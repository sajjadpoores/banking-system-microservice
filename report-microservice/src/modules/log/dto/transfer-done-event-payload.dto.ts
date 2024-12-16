import { TransferType } from 'src/shared/enum/transfer-type.enum';

export class TransferDoneEventPayloadDto {
  transactionNumber: number;
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
}
