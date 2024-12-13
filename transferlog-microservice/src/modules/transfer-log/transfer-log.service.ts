import { Injectable } from '@nestjs/common';
import { TransferDoneEventPayloadDto } from './dto/transfer-done-event-payload.dto';
import { TransferLogRepository } from 'src/shared/repository/transfer-log.repository';

@Injectable()
export class TransferLogService {
  constructor(private readonly _transferLogRepository: TransferLogRepository) {}

  async transfer(payload: TransferDoneEventPayloadDto): Promise<boolean> {
    try {
      await this._transferLogRepository.create({
        transferNumber: payload.transferNumber,
        sourceAccount: payload.sourceAccountNumber,
        sourceUserId: payload.sourceUserId,
        sourceBalance: payload.sourceBalance,
        destinationAccount: payload.destinationAccountNumber,
        destinationUserId: payload.destinationUserId,
        destinationBalance: payload.destinationBalance,
        amount: payload.amount,
        type: payload.type,
        date: new Date(payload.transferDate),
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
