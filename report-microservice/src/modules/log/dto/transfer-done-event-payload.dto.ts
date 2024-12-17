import { TransactionStatus } from 'src/shared/enum/transaction-status.enum';
import { TransferType } from 'src/shared/enum/transfer-type.enum';

export class TransferDoneEventPayloadDto {
  transactionNumber: string;
  type: TransferType;
  destinationAccountNumber: number;
  destinationUserId: string;
  destinationBalance: number;
  sourceAccountNumber: number;
  sourceUserId: string;
  sourceBalance: number;
  amount: number;
  transferDate: Date;
  description: string;
  status: TransactionStatus;
}
