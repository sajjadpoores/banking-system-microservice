import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';
import { TransferBodyDto } from './dto/transfer-body.dto';

@Controller('transaction')
@ApiTags('Transaction')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly _transactionService: TransactionService) {}

  @Post('transfer')
  @ApiOperation({ summary: 'انتقال وجه از یک حساب به حساب دیگر' })
  @ApiOkResponse({
    status: 201,
    description: 'Transaction is sent.',
    type: ResponseModel<TransferResponseDto>,
  })
  async transfer(
    @Body() payload: TransferBodyDto,
  ): Promise<ResponseModel<TransferResponseDto>> {
    return this._transactionService.transfer(payload);
  }
}
