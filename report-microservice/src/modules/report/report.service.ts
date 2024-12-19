import { Injectable } from '@nestjs/common';
import { TransferLogRepository } from 'src/shared/repository/transfer-log.repository';
import { GetTurnoverResponseDto } from './dto/get-turnover-response.dto';
import { GetTurnoverQueryDto } from './dto/get-turnover.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { ReponseStatus } from 'src/shared/enum/response-status.enum';
import { TurnoverType } from 'src/shared/enum/turnover-type.enum';
import { GetTransactionDetailQueryDto } from './dto/get-transaction-detail-query.dto';
import { GetTransactionDetailResponseDto } from './dto/get-transaction-detail-response.dto';
import { TransferLog } from 'src/shared/schema/transfer-log.schema';
import { TransferType } from 'src/shared/enum/transfer-type.enum';

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
        message: 'No transactions found.',
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
        type: this._determineTurnoverType(txn, payload.accountNumber),
        destinationAccountNumber: txn.destinationAccount,
        sourceAccoutNumber: txn.sourceAccount,
        transactionNumber: `${txn.transferNumber}`,
        status: txn.status,
      }),
    );

    return {
      status: ReponseStatus.SUCCESS,
      message: 'Transactions retrieved successfully.',
      data: formattedTransactions,
    };
  }

  private _determineTurnoverType(tnx: TransferLog, accountNumber: number) {
    if (tnx.type === TransferType.DEPOSIT) {
      return TurnoverType.DEPOSIT;
    } else if (tnx.type === TransferType.WITHDRAWAL) {
      return TurnoverType.WITHDRAWAL;
    } else if (tnx.type === TransferType.GIFT) {
      return TurnoverType.DEPOSIT;
    } else if (
      tnx.type === TransferType.TRANSFER ||
      tnx.type === TransferType.HARD_TRANSFER
    ) {
      if (accountNumber === tnx.destinationAccount) {
        return TurnoverType.DEPOSIT;
      } else {
        return TurnoverType.WITHDRAWAL;
      }
    }
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
        message: 'Transaction not found.',
        data: null,
      };
    }

    if (
      payload.userId !== transaction.sourceUserId &&
      payload.userId !== transaction.destinationUserId
    ) {
      return {
        status: ReponseStatus.FAILED,
        message: 'You do not have permission to get transaction detail',
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
      status: transaction.status,
    };

    return {
      status: ReponseStatus.SUCCESS,
      message: 'Transaction details retrieved successfully.',
      data: response,
    };
  }
}
