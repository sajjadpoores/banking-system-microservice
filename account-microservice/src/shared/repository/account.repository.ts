import { DataSource, Repository } from 'typeorm';
import { AccountEntity } from '../entity/acccount.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { TransferBodyDto } from 'src/modules/account/dto/transfer-body.dto';
import { TransferType } from '../enum/transfer-type.enum';
import { OutboxEntity } from '../entity/outbox.entity';
import { DepositBodyDto } from 'src/modules/account/dto/deposit-body.dto';
import { DepositResponseDto } from 'src/modules/account/dto/deposit-response.dto';
import { CreateAccountBodyDto } from 'src/modules/account/dto/create-account-body.dto';

export class AccountRepository extends Repository<AccountEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(AccountEntity, dataSource.createEntityManager());
  }

  async createAccount(
    payload: CreateAccountBodyDto,
    initialGiftAmount: number,
  ) {
    let account: AccountEntity;
    await this.dataSource.transaction(async (manager) => {
      account = await manager.save(AccountEntity, {
        userId: payload.userId,
        balance: initialGiftAmount,
      });

      const transferNumberQueryResult = await manager.query(
        "SELECT nextval('transaction_number_seq')",
      );

      const transactionNumber = transferNumberQueryResult[0].nextval.toString();

      const outbox = manager.create(OutboxEntity, {
        aggregateId: `${account.id}`,
        type: TransferType.GITF,
        payload: {
          transactionNumber,
          destinationAccountNumber: account.accountNumber,
          destinationBalance: account.balance,
          destinationUserId: account.userId,
          amount: initialGiftAmount,
          depositDate: new Date(),
          type: TransferType.GITF,
        },
      });
      await manager.save(outbox);
    });
    return {
      accountNumber: account.accountNumber,
      balance: account.balance,
    };
  }

  async easyTransfer(payload: TransferBodyDto) {
    let sourceAccount: AccountEntity;
    await this.dataSource.transaction(async (manager) => {
      sourceAccount = await manager.findOne(AccountEntity, {
        where: { accountNumber: payload.sourceAccountNumber },
        lock: { mode: 'pessimistic_write' },
      });

      if (!sourceAccount) {
        throw new Error('Source account not found.');
      }

      if (sourceAccount.balance < payload.amount) {
        throw new Error('Insufficient balance in source account.');
      }

      const destinationAccount = await manager.findOne(AccountEntity, {
        where: { accountNumber: payload.destinationAccountNumber },
        lock: { mode: 'pessimistic_write' },
      });

      if (!destinationAccount) {
        throw new Error('Destination account not found.');
      }

      sourceAccount.balance -= payload.amount;
      destinationAccount.balance += payload.amount;

      await manager.save(sourceAccount);
      await manager.save(destinationAccount);

      const outbox = manager.create(OutboxEntity, {
        aggregateId: payload.transactionNumber,
        type: TransferType.TRANSFER,
        payload: {
          transactionNumber: payload.transactionNumber,
          amount: payload.amount,
          description: payload.description,
          destinationAccountNumber: payload.destinationAccountNumber,
          destinationBalance: destinationAccount.balance,
          sourceAccountNumber: payload.sourceAccountNumber,
          sourceBalance: sourceAccount.balance,
          destinationUserId: destinationAccount.userId,
          sourceUserId: sourceAccount.userId,
          transferDate: new Date(),
          type: TransferType.TRANSFER,
        },
      });

      await manager.save(outbox);
    });

    return {
      transactionNumber: payload.transactionNumber,
      balance: sourceAccount.balance,
    };
  }

  async hardTransfer(payload: TransferBodyDto) {
    let sourceAccount: AccountEntity;

    await this.dataSource.transaction(async (manager) => {
      sourceAccount = await manager.findOne(AccountEntity, {
        where: { accountNumber: payload.sourceAccountNumber },
        lock: { mode: 'pessimistic_write' },
      });

      if (!sourceAccount) {
        throw new Error('Source account not found.');
      }

      if (sourceAccount.balance < payload.amount) {
        throw new Error('Insufficient balance in source account.');
      }

      if (sourceAccount.lastHardTransferDate) {
        const fourHoursInMs = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
        const currentTime = new Date();
        const lastTransferTime = new Date(sourceAccount.lastHardTransferDate);
        const timeDifference =
          currentTime.getTime() - lastTransferTime.getTime();

        if (timeDifference < fourHoursInMs) {
          const hoursLeft = (
            (fourHoursInMs - timeDifference) /
            (1000 * 60 * 60)
          ).toFixed(2);
          throw new Error(
            `Hard transfer can only be performed once every 4 hours. Please wait ${hoursLeft} more hours.`,
          );
        }
      }

      const destinationAccount = await manager.findOne(AccountEntity, {
        where: { accountNumber: payload.destinationAccountNumber },
        lock: { mode: 'pessimistic_write' },
      });

      if (!destinationAccount) {
        throw new Error('Destination account not found.');
      }

      sourceAccount.balance -= payload.amount;
      sourceAccount.lastHardTransferDate = new Date();
      destinationAccount.balance += payload.amount;

      await manager.save(sourceAccount);
      await manager.save(destinationAccount);

      const outbox = manager.create(OutboxEntity, {
        aggregateId: payload.transactionNumber,
        type: TransferType.HARD_TRANSFER,
        payload: {
          transactionNumber: payload.transactionNumber,
          amount: payload.amount,
          description: payload.description,
          destinationAccountNumber: payload.destinationAccountNumber,
          destinationBalance: destinationAccount.balance,
          sourceAccountNumber: payload.sourceAccountNumber,
          sourceBalance: sourceAccount.balance,
          destinationUserId: destinationAccount.userId,
          sourceUserId: sourceAccount.userId,
          transferDate: new Date(),
          type: TransferType.HARD_TRANSFER,
        },
      });

      await manager.save(outbox);
    });

    return {
      transactionNumber: payload.transactionNumber,
      balance: sourceAccount.balance,
    };
  }

  async deposit(
    payload: DepositBodyDto,
    dailyLimit: number,
  ): Promise<DepositResponseDto> {
    let transactionNumber: string;
    let account: AccountEntity;

    await this.dataSource.transaction(async (manager) => {
      account = await manager.findOne(AccountEntity, {
        where: { accountNumber: payload.accountNumber },
        lock: { mode: 'pessimistic_write' },
      });

      if (!account) {
        throw new Error('Account not found.');
      }

      const today = new Date();
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );

      // check sum of account today's deposit
      if (payload.amount > dailyLimit) {
        throw new Error(`Daily deposit limit of ${dailyLimit} exceeded.`);
      }

      if (
        account.lastDepositDate &&
        this._isSameDay(account.lastDepositDate, todayDate)
      ) {
        const newTodayDepositSum = account.todayDepositSum + payload.amount;
        console.log(newTodayDepositSum);
        if (newTodayDepositSum > dailyLimit) {
          throw new Error(`Daily deposit limit of ${dailyLimit} exceeded.`);
        }
        account.todayDepositSum = newTodayDepositSum;
      } else {
        account.todayDepositSum = payload.amount;
        account.lastDepositDate = todayDate;
      }

      account.balance += payload.amount;
      await manager.save(account);

      const transactionNumberQueryResult = await manager.query(
        "SELECT nextval('transaction_number_seq')",
      );
      transactionNumber = transactionNumberQueryResult[0].nextval.toString();

      const outbox = manager.create(OutboxEntity, {
        aggregateId: transactionNumber,
        type: TransferType.DEPOSIT,
        payload: {
          transactionNumber,
          destinationAccountNumber: payload.accountNumber,
          destinationBalance: account.balance,
          destinationUserId: account.userId,
          amount: payload.amount,
          depositDate: new Date(),
          type: TransferType.DEPOSIT,
        },
      });

      await manager.save(outbox);
    });

    return {
      transactionNumber,
      balance: account.balance,
    };
  }

  async findAccountByNumber(
    accountNumber: number,
  ): Promise<AccountEntity | null> {
    const account = await this.findOne({
      where: { accountNumber },
    });
    return account || null;
  }

  private _isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
