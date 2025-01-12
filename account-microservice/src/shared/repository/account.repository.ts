import { DataSource, Repository } from 'typeorm';
import { AccountEntity } from '../entity/acccount.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { TransferBodyDto } from 'src/modules/account/dto/transfer-body.dto';
import { TransferType } from '../enum/transfer-type.enum';
import { OutboxEntity } from '../entity/outbox.entity';
import { DepositBodyDto } from 'src/modules/account/dto/deposit-body.dto';
import { DepositResponseDto } from 'src/modules/account/dto/deposit-response.dto';
import { CreateAccountBodyDto } from 'src/modules/account/dto/create-account-body.dto';
import { TransactionStatus } from '../enum/transaction-status.enum';
import { withdrawBodyDto } from 'src/modules/account/dto/withdraw-body.dto';
import { withdrawResponseDto } from 'src/modules/account/dto/withdraw-response.dto';
import { AccountNotFoundException } from '../error/account-not-found.error';
import { InsufficientBalanceException } from '../error/insufficient-balance.error';
import { DailyDepositLimitExceededException } from '../error/daily-deposit-limit.error';

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
          status: TransactionStatus.DONE,
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
    try {
      await this.dataSource.transaction(async (manager) => {
        sourceAccount = await manager.findOne(AccountEntity, {
          where: { accountNumber: payload.sourceAccountNumber },
          lock: { mode: 'pessimistic_write' },
        });

        if (!sourceAccount) {
          throw new AccountNotFoundException(payload.sourceAccountNumber);
        }

        if (sourceAccount.balance < payload.amount) {
          throw new InsufficientBalanceException();
        }

        const destinationAccount = await manager.findOne(AccountEntity, {
          where: { accountNumber: payload.destinationAccountNumber },
          lock: { mode: 'pessimistic_write' },
        });

        if (!destinationAccount) {
          throw new AccountNotFoundException(payload.destinationAccountNumber);
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
            status: TransactionStatus.DONE,
          },
        });

        await manager.save(outbox);
      });

      return {
        transactionNumber: payload.transactionNumber,
        balance: sourceAccount.balance,
      };
    } catch (error) {
      const outbox = this.dataSource.getRepository(OutboxEntity).create({
        aggregateId: payload.transactionNumber,
        type: TransferType.TRANSFER,
        payload: {
          transactionNumber: payload.transactionNumber,
          amount: payload.amount,
          description: payload.description,
          destinationAccountNumber: payload.destinationAccountNumber,
          destinationBalance: 0,
          sourceAccountNumber: payload.sourceAccountNumber,
          sourceBalance: 0,
          destinationUserId: 0,
          sourceUserId: 0,
          transferDate: new Date(),
          type: TransferType.TRANSFER,
          status: TransactionStatus.FAILED,
        },
      });

      await this.dataSource.getRepository(OutboxEntity).save(outbox);

      throw error;
    }
  }

  async hardTransfer(payload: TransferBodyDto) {
    let sourceAccount: AccountEntity;
    try {
      await this.dataSource.transaction(async (manager) => {
        sourceAccount = await manager.findOne(AccountEntity, {
          where: { accountNumber: payload.sourceAccountNumber },
          lock: { mode: 'pessimistic_write' },
        });

        if (!sourceAccount) {
          throw new AccountNotFoundException(payload.sourceAccountNumber);
        }

        if (sourceAccount.balance < payload.amount) {
          throw new InsufficientBalanceException();
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
          throw new AccountNotFoundException(payload.destinationAccountNumber);
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
            status: TransactionStatus.DONE,
          },
        });

        await manager.save(outbox);
      });

      return {
        transactionNumber: payload.transactionNumber,
        balance: sourceAccount.balance,
      };
    } catch (error) {
      const outbox = this.dataSource.getRepository(OutboxEntity).create({
        aggregateId: payload.transactionNumber,
        type: TransferType.HARD_TRANSFER,
        payload: {
          transactionNumber: payload.transactionNumber,
          amount: payload.amount,
          description: payload.description,
          destinationAccountNumber: payload.destinationAccountNumber,
          destinationBalance: 0,
          sourceAccountNumber: payload.sourceAccountNumber,
          sourceBalance: 0,
          destinationUserId: 0,
          sourceUserId: 0,
          transferDate: new Date(),
          type: TransferType.HARD_TRANSFER,
          status: TransactionStatus.FAILED,
        },
      });

      await this.dataSource.getRepository(OutboxEntity).save(outbox);

      throw error;
    }
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
        throw new AccountNotFoundException(payload.accountNumber);
      }

      const today = new Date();
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );

      // check sum of account today's deposit
      if (payload.amount > dailyLimit) {
        throw new DailyDepositLimitExceededException(dailyLimit);
      }

      if (
        account.lastDepositDate &&
        this._isSameDay(account.lastDepositDate, todayDate)
      ) {
        const newTodayDepositSum = account.todayDepositSum + payload.amount;
        if (newTodayDepositSum > dailyLimit) {
          throw new DailyDepositLimitExceededException(dailyLimit);
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
          status: TransactionStatus.DONE,
        },
      });

      await manager.save(outbox);
    });

    return {
      transactionNumber,
      balance: account.balance,
    };
  }

  async withdraw(payload: withdrawBodyDto): Promise<withdrawResponseDto> {
    let transactionNumber: string;
    let account: AccountEntity;

    await this.dataSource.transaction(async (manager) => {
      account = await manager.findOne(AccountEntity, {
        where: { accountNumber: payload.accountNumber },
        lock: { mode: 'pessimistic_write' },
      });

      if (!account) {
        throw new AccountNotFoundException(payload.accountNumber);
      }

      if (account.balance < payload.amount) {
        throw new InsufficientBalanceException();
      }

      account.balance -= payload.amount;
      await manager.save(account);

      const transactionNumberQueryResult = await manager.query(
        "SELECT nextval('transaction_number_seq')",
      );
      transactionNumber = transactionNumberQueryResult[0].nextval.toString();

      const outbox = manager.create(OutboxEntity, {
        aggregateId: transactionNumber,
        type: TransferType.WITHDRAWAL,
        payload: {
          transactionNumber,
          destinationAccountNumber: payload.accountNumber,
          destinationBalance: account.balance,
          destinationUserId: account.userId,
          amount: payload.amount,
          depositDate: new Date(),
          type: TransferType.WITHDRAWAL,
          status: TransactionStatus.DONE,
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
