import { TransactionStatus } from 'src/shared/enum/transaction-status.enum';
import { TransferType } from 'src/shared/enum/transfer-type.enum';

export class GetTransactionDetailResponseDto {
  transactionNumber: string;
  sourceAccountNumber?: number;
  destinationAccountNumber: number;
  transferType: TransferType;
  amount: number;
  transactionDate: string;
  description: string;
  status: TransactionStatus;
}
