import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { GetTurnoverResponseDto } from './dto/get-turnover-response.dto';
import { GetTurnoverQueryDto } from './dto/get-turnover-query.dto';
import { GetTransactionDetailResponseDto } from './dto/get-transaction-detail-response.dto';
import { GetTransactionDetailQueryDto } from './dto/get-transaction-detail-query.dto';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly _reportService: ReportService) {}

  @Get('turnover')
  @ApiOperation({ summary: 'دریافت گردش حساب' })
  @ApiOkResponse({
    status: 200,
    description: 'گردش حساب با موفقیت دریافت شد.',
    type: ResponseModel<GetTurnoverResponseDto>,
  })
  async getAccountTurnover(
    @Query() filters: GetTurnoverQueryDto,
  ): Promise<ResponseModel<GetTurnoverResponseDto>> {
    return this._reportService.getAccountTurnover(filters);
  }

  @Get('transaction')
  @ApiOperation({ summary: 'پیگیری تراکنش' })
  @ApiOkResponse({
    status: 200,
    description: 'جزئیات تراکنش با موفقیت دریافت شد.',
    type: ResponseModel<GetTransactionDetailResponseDto>,
  })
  async getTransactionDetail(
    @Query() query: GetTransactionDetailQueryDto,
  ): Promise<ResponseModel<GetTransactionDetailResponseDto>> {
    return this._reportService.getTransactionDetail(query);
  }
}
