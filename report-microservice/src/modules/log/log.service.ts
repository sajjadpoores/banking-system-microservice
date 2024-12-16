import { Injectable } from '@nestjs/common';
import { TransferDoneEventPayloadDto } from './dto/transfer-done-event-payload.dto';
import { TransferLogRepository } from 'src/shared/repository/transfer-log.repository';
import { DepositDoneEventPayloadDto } from './dto/deposit-done-event-payload.dto';
import { GiftDoneEventPayloadDto } from './dto/gift-done-event-payload.dto';

@Injectable()
export class LogService {
  constructor(private readonly _transferLogRepository: TransferLogRepository) {}

  async transfer(payload: TransferDoneEventPayloadDto): Promise<boolean> {
    try {
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
