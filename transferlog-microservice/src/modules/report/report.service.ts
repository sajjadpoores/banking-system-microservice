import { Injectable } from '@nestjs/common';
import { TransferLogRepository } from 'src/shared/repository/transfer-log.repository';
import { GetTurnoverResponseDto } from './dto/get-turnover-response.dto';
import { GetTurnoverQueryDto } from './dto/get-turnover-body.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { ReponseStatus } from 'src/shared/enum/response-status.enum';
import { TurnoverType } from 'src/shared/enum/turnover-type.enum';

@Injectable()
export class ReportService {
  constructor(private readonly _transferLogRepository: TransferLogRepository) {}

  async getTurnover(
    filters: GetTurnoverQueryDto,
  ): Promise<ResponseModel<GetTurnoverResponseDto>> {
    const transactions = await this._transferLogRepository.getTurnover(filters);

    if (!transactions.length) {
      return {
        status: ReponseStatus.SUCCESS,
        message: 'هیچ تراکنشی یافت نشد.',
        data: [],
      };
    }

    const formattedTransactions: GetTurnoverResponseDto[] = transactions.map(
      (txn) => ({
        amount: txn.amount,
        balance:
          filters.accountNumber === txn.destinationAccount
            ? txn.destinationBalance
            : txn.sourceBalance,
        description: txn.description,
        transactionDate: txn.date.toISOString(),
        type:
          filters.accountNumber === txn.destinationAccount
            ? TurnoverType.DEPOSIT
            : TurnoverType.WITHDRAWAL,
        destinationAccountNumber: txn.destinationAccount,
        sourceAccoutNumber: txn.sourceAccount,
        transactionNumber: `${txn.transferNumber}`,
      }),
    );

    return {
      status: ReponseStatus.SUCCESS,
      message: 'تراکنش‌ها با موفقیت دریافت شدند.',
      data: formattedTransactions,
    };
  }
}
