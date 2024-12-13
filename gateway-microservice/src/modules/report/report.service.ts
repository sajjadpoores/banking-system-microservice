import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetTurnoverQueryDto } from './dto/get-turnover-body.dto';
import { GetTurnoverResponseDto } from './dto/get-turnover-response.dto';
import { firstValueFrom } from 'rxjs';
import { ResponseModel } from 'src/shared/dto/response-model.dto';

@Injectable()
export class ReportService {
  constructor(
    @Inject('report_broker')
    private readonly _rabbitmqClient: ClientProxy,
  ) {}

  async getAccountTurnover(
    filters: GetTurnoverQueryDto,
  ): Promise<ResponseModel<GetTurnoverResponseDto>> {
    const response = await firstValueFrom<
      ResponseModel<GetTurnoverResponseDto>
    >(this._rabbitmqClient.send('report.turnover', filters));

    return response;
  }
}
