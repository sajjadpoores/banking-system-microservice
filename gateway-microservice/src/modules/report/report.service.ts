import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetTurnoverQueryDto } from './dto/get-turnover-query.dto';
import { GetTurnoverResponseDto } from './dto/get-turnover-response.dto';
import { firstValueFrom } from 'rxjs';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { GetTransactionDetailResponseDto } from './dto/get-transaction-detail-response.dto';
import { GetTransactionDetailQueryDto } from './dto/get-transaction-detail-query.dto';

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

  async getTransactionDetail(
    query: GetTransactionDetailQueryDto,
    userId: string,
  ): Promise<ResponseModel<GetTransactionDetailResponseDto>> {
    const response = await firstValueFrom<
      ResponseModel<GetTransactionDetailResponseDto>
    >(
      this._rabbitmqClient.send('report.transactionDetail', {
        ...query,
        userId,
      }),
    );

    return response;
  }
}
