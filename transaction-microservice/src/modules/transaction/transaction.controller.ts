import { Controller } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransferBodyDto } from './dto/transfer-body.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly _transactionService: TransactionService) {}

  @MessagePattern('transaction.transfer')
  async transactionTransfer(
    @Payload() payload: TransferBodyDto,
  ): Promise<ResponseModel<TransferResponseDto>> {
    return this._transactionService.transfer(payload);
  }
}
