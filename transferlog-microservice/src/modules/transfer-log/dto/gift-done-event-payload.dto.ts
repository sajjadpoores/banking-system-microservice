import { TransferType } from 'src/shared/enum/transfer-type.enum';

export class GiftDoneEventPayloadDto {
  transactionNumber: string;
  type: TransferType;
  destinationAccountNumber: number;
  destinationUserId: string;
  destinationBalance: number;
  amount: number;
  depositDate: Date;
}
