import { TransferType } from 'src/shared/enum/transfer-type.enum';

export class DepositDoneEventPayloadDto {
  transactionNumber: string;
  type: TransferType;
  destinationAccountNumber: number;
  destinationUserId: string;
  destinationBalance: number;
  amount: number;
  depositDate: Date;
}
