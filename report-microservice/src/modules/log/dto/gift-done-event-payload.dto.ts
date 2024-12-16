import { TransactionStatus } from 'src/shared/enum/transaction-status.enum';
import { TransferType } from 'src/shared/enum/transfer-type.enum';

export class GiftDoneEventPayloadDto {
  transactionNumber: string;
  type: TransferType;
  destinationAccountNumber: number;
  destinationUserId: string;
  destinationBalance: number;
  amount: number;
  depositDate: Date;
  status: TransactionStatus;
}
