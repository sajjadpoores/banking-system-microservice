import { TransactionStatus } from 'src/shared/enum/transaction-status.enum';

export class TransferResponseDto {
  transactionNumber: string;
  transactionStatus: TransactionStatus;
}
