import { Injectable } from '@nestjs/common';
import { TransferLogRepository } from 'src/shared/repository/transfer-log.repository';
import { GetTurnoverResponseDto } from './dto/get-turnover-response.dto';
import { GetTurnoverQueryDto } from './dto/get-turnover.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { ReponseStatus } from 'src/shared/enum/response-status.enum';
import { TurnoverType } from 'src/shared/enum/turnover-type.enum';
import { GetTransactionDetailQueryDto } from './dto/get-transaction-detail-query.dto';
import { GetTransactionDetailResponseDto } from './dto/get-transaction-detail-response.dto';

@Injectable()
export class ReportService {
  constructor(private readonly _transferLogRepository: TransferLogRepository) {}

  async getTurnover(
    payload: GetTurnoverQueryDto,
  ): Promise<ResponseModel<GetTurnoverResponseDto>> {
    const transactions = await this._transferLogRepository.getTurnover(payload);

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
          payload.accountNumber === txn.destinationAccount
            ? txn.destinationBalance
            : txn.sourceBalance,
        description: txn.description,
        transactionDate: txn.date.toISOString(),
        type:
          payload.accountNumber === txn.destinationAccount
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

  async getTransactionDetail(
    payload: GetTransactionDetailQueryDto,
  ): Promise<ResponseModel<GetTransactionDetailResponseDto>> {
    const transaction =
      await this._transferLogRepository.findByTransactionNumber(
        payload.transactionNumber,
      );

    if (!transaction) {
      return {
        status: ReponseStatus.FAILED,
        message: 'تراکنش یافت نشد.',
        data: null,
      };
    }

    const response: GetTransactionDetailResponseDto = {
      transactionNumber: `${transaction.transferNumber}`,
      sourceAccountNumber: transaction.sourceAccount,
      destinationAccountNumber: transaction.destinationAccount,
      transferType: transaction.type,
      amount: transaction.amount,
      transactionDate: transaction.date.toISOString(),
      description: transaction.description || '',
    };

    return {
      status: ReponseStatus.SUCCESS,
      message: 'جزئیات تراکنش با موفقیت دریافت شد.',
      data: response,
    };
  }
}
