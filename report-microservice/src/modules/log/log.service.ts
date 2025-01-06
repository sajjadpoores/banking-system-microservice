import { Injectable } from '@nestjs/common';
import { TransferDoneEventPayloadDto } from './dto/transfer-done-event-payload.dto';
import { TransferLogRepository } from 'src/shared/repository/transfer-log.repository';
import { DepositDoneEventPayloadDto } from './dto/deposit-done-event-payload.dto';
import { GiftDoneEventPayloadDto } from './dto/gift-done-event-payload.dto';
import { TransferStartedPayloadDto } from './dto/transfer-started-payload.dto';
import { TransferType } from 'src/shared/enum/transfer-type.enum';
import { TransactionStatus } from 'src/shared/enum/transaction-status.enum';
import { WithdrawDoneEventPayloadDto } from './dto/withdraw-done-event-payload.dto';

@Injectable()
export class LogService {
  constructor(private readonly _transferLogRepository: TransferLogRepository) {}

  async transferStarted(payload: TransferStartedPayloadDto): Promise<boolean> {
    try {
      await this._transferLogRepository.create({
        transferNumber: payload.transactionNumber,
        sourceAccount: payload.sourceAccountNumber,
        sourceUserId: payload.sourceUserId,
        destinationAccount: payload.destinationAccountNumber,
        description: payload.description,
        amount: payload.amount,
        type: TransferType.TRANSFER,
        date: new Date(),
        status: TransactionStatus.PENDING,
      });
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async transferFinished(
    payload: TransferDoneEventPayloadDto,
  ): Promise<boolean> {
    try {
      const transaction =
        await this._transferLogRepository.findByTransactionNumber(
          payload.transactionNumber,
        );
      if (transaction) {
        transaction.sourceAccount = payload.sourceAccountNumber;
        transaction.sourceUserId =
          transaction.sourceUserId || payload.sourceUserId;
        transaction.sourceBalance = payload.sourceBalance;
        transaction.destinationBalance = payload.destinationBalance;
        transaction.destinationUserId = payload.destinationUserId;
        transaction.description = payload.description;
        transaction.amount = payload.amount;
        transaction.type = payload.type;
        transaction.date = new Date(payload.transferDate);
        transaction.status = payload.status;
        await this._transferLogRepository.update(
          transaction._id.toHexString(),
          transaction,
        );
      } else {
        await this._transferLogRepository.create({
          transferNumber: payload.transactionNumber,
          sourceAccount: payload.sourceAccountNumber,
          sourceUserId: payload.sourceUserId,
          sourceBalance: payload.sourceBalance,
          destinationAccount: payload.destinationAccountNumber,
          destinationUserId: payload.destinationUserId,
          destinationBalance: payload.destinationBalance,
          description: payload.description,
          amount: payload.amount,
          type: payload.type,
          date: new Date(payload.transferDate),
          status: payload.status,
        });
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deposit(payload: DepositDoneEventPayloadDto): Promise<boolean> {
    try {
      await this._transferLogRepository.create({
        transferNumber: payload.transactionNumber,
        sourceAccount: null,
        sourceUserId: null,
        sourceBalance: null,
        destinationAccount: payload.destinationAccountNumber,
        destinationUserId: payload.destinationUserId,
        destinationBalance: payload.destinationBalance,
        amount: payload.amount,
        type: payload.type,
        date: new Date(payload.depositDate),
        status: payload.status,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async withdraw(payload: WithdrawDoneEventPayloadDto): Promise<boolean> {
    try {
      await this._transferLogRepository.create({
        transferNumber: payload.transactionNumber,
        sourceAccount: null,
        sourceUserId: null,
        sourceBalance: null,
        destinationAccount: payload.destinationAccountNumber,
        destinationUserId: payload.destinationUserId,
        destinationBalance: payload.destinationBalance,
        amount: payload.amount,
        type: payload.type,
        date: new Date(payload.depositDate),
        status: payload.status,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async gift(payload: GiftDoneEventPayloadDto): Promise<boolean> {
    try {
      await this._transferLogRepository.create({
        transferNumber: payload.transactionNumber,
        sourceAccount: null,
        sourceUserId: null,
        sourceBalance: null,
        destinationAccount: payload.destinationAccountNumber,
        destinationUserId: payload.destinationUserId,
        destinationBalance: payload.destinationBalance,
        amount: payload.amount,
        type: payload.type,
        date: new Date(payload.depositDate),
        status: payload.status,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
