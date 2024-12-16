import { Controller } from '@nestjs/common';
import { ReportService } from './report.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetTurnoverQueryDto } from './dto/get-turnover.dto';
import { GetTurnoverResponseDto } from './dto/get-turnover-response.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { GetTransactionDetailQueryDto } from './dto/get-transaction-detail-query.dto';
import { GetTransactionDetailResponseDto } from './dto/get-transaction-detail-response.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly _reportService: ReportService) {}

  @MessagePattern('report.turnover')
  async getTurnover(
    @Payload() payload: GetTurnoverQueryDto,
  ): Promise<ResponseModel<GetTurnoverResponseDto>> {
    return this._reportService.getTurnover(payload);
  }

  @MessagePattern('report.transactionDetail')
  async getTransactionDetail(
    @Payload() payload: GetTransactionDetailQueryDto,
  ): Promise<ResponseModel<GetTransactionDetailResponseDto>> {
    return this._reportService.getTransactionDetail(payload);
  }
}
