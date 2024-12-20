// src/transaction/transaction.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';
import { TransferBodyDto } from './dto/transfer-body.dto';
import { RequireAccountAccess } from 'src/shared/decorator/require-account-access.decorator';
import { User } from 'src/shared/decorator/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';

@ApiTags('Transaction')
@Controller('transaction')
@ApiBearerAuth()
@ApiExtraModels(ResponseModel, TransferResponseDto)
export class TransactionController {
  constructor(private readonly _transactionService: TransactionService) {}

  @Post('transfer')
  @RequireAccountAccess('sourceAccountNumber')
  @ApiOperation({ summary: 'Transfer funds from one account to another' })
  @ApiOkResponse({
    status: 201,
    description: 'Transaction is sent.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(TransferResponseDto) },
          },
        },
      ],
    },
  })
  async transfer(
    @Body() payload: TransferBodyDto,
    @User() user: IUser,
  ): Promise<ResponseModel<TransferResponseDto>> {
    return this._transactionService.transfer({
      ...payload,
      userId: user.userId,
    });
  }
}
