import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TransferBodyDto } from './dto/transfer-body.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';
import { ReponseStatus } from 'src/shared/enum/response-status.enum';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('transaction_broker')
    private readonly _rabbitmqClient: ClientProxy,
  ) {}

  async transfer(
    payload: TransferBodyDto,
  ): Promise<ResponseModel<TransferResponseDto>> {
    if (payload.sourceAccountNumber === payload.destinationAccountNumber) {
      return {
        status: ReponseStatus.FAILED,
        message: 'Source and destination accounts cannot be the same',
        data: null,
      };
    }
    return firstValueFrom(
      this._rabbitmqClient.send<ResponseModel<TransferResponseDto>>(
        'transaction.transfer',
        payload,
      ),
    );
  }
}
