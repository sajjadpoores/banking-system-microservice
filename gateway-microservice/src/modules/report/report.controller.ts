import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { GetTurnoverResponseDto } from './dto/get-turnover-response.dto';
import { GetTurnoverQueryDto } from './dto/get-turnover-query.dto';
import { GetTransactionDetailResponseDto } from './dto/get-transaction-detail-response.dto';
import { GetTransactionDetailQueryDto } from './dto/get-transaction-detail-query.dto';
import { RequireAccountAccess } from 'src/shared/decorator/require-account-access.decorator';
import { User } from 'src/shared/decorator/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';

@ApiTags('Report')
@Controller('report')
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly _reportService: ReportService) {}

  @Get('turnover')
  @ApiOperation({ summary: 'Get account turnover' })
  @RequireAccountAccess('accountNumber')
  @ApiOkResponse({
    status: 200,
    description: 'Account turnover retrieved successfully.',
    type: ResponseModel<GetTurnoverResponseDto>,
  })
  async getAccountTurnover(
    @Query() filters: GetTurnoverQueryDto,
  ): Promise<ResponseModel<GetTurnoverResponseDto>> {
    return this._reportService.getAccountTurnover(filters);
  }

  @Get('transaction')
  @ApiOperation({ summary: 'Track transaction' })
  @ApiOkResponse({
    status: 200,
    description: 'Transaction details retrieved successfully.',
    type: ResponseModel<GetTransactionDetailResponseDto>,
  })
  async getTransactionDetail(
    @Query() query: GetTransactionDetailQueryDto,
    @User() user: IUser,
  ): Promise<ResponseModel<GetTransactionDetailResponseDto>> {
    return this._reportService.getTransactionDetail(query, user.userId);
  }
}
