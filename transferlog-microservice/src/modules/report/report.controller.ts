import { Controller } from '@nestjs/common';
import { ReportService } from './report.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetTurnoverQueryDto } from './dto/get-turnover-body.dto';
import { GetTurnoverResponseDto } from './dto/get-turnover-response.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly _reportService: ReportService) {}

  @MessagePattern('report.turnover')
  async getTurnover(
    @Payload() filters: GetTurnoverQueryDto,
  ): Promise<ResponseModel<GetTurnoverResponseDto>> {
    return this._reportService.getTurnover(filters);
  }
}
