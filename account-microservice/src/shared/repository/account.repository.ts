import { DataSource, Repository } from 'typeorm';
import { AccountEntity } from '../entity/acccount.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { TransferBodyDto } from 'src/modules/account/dto/transfer-body.dto';
import { firstValueFrom } from 'rxjs';
import { ResponseModel } from '../dto/response-model.dto';
import { TransferDoneEventPayloadDto } from 'src/modules/account/dto/transfer-done-body.dto';
import { TransferType } from '../enum/transfer-type.enum';
import { ClientProxy } from '@nestjs/microservices';

export class AccountRepository extends Repository<AccountEntity> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(AccountEntity, dataSource.createEntityManager());
  }

  async transfer(payload: TransferBodyDto, _rabbitmqClient: ClientProxy) {
    let sourceAccount: AccountEntity;
    let destinationAccount: AccountEntity;

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

      destinationAccount = await manager.findOne(AccountEntity, {
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

      const transferNumberQueryResult = await manager.query(
        "SELECT nextval('transaction_number_seq')",
      );
      const transferNumber = transferNumberQueryResult[0].nextval.toString();

      // notify transferLog microservice
      await firstValueFrom(
        _rabbitmqClient.send<ResponseModel<boolean>, TransferDoneEventPayloadDto>(
          'transfer.done',
          {
            transferNumber,
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
        ),
      );
    });

    return {
      balance: sourceAccount.balance,
    };
  }

  async hardTransfer(payload: TransferBodyDto, _rabbitmqClient: ClientProxy) {
    let sourceAccount: AccountEntity;
    let destinationAccount: AccountEntity;

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

      destinationAccount = await manager.findOne(AccountEntity, {
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

      const transferNumberQueryResult = await manager.query(
        "SELECT nextval('transaction_number_seq')",
      );
      const transferNumber = transferNumberQueryResult[0].nextval.toString();

      // notify transferLog microservice
      const notifyResult = await firstValueFrom(
        _rabbitmqClient.send<ResponseModel<boolean>, TransferDoneEventPayloadDto>(
          'transfer.done',
          {
            transferNumber,
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
        ),
      );

      if (!notifyResult) {
        throw new Error('Error in notify!');
      }
    });

    return {
      balance: sourceAccount.balance,
    };
  }
}
