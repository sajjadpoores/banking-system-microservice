export class TransferStartedPayloadDto {
  transactionNumber: string;
  sourceUserId: string;
  sourceAccountNumber: number;
  destinationAccountNumber: number;
  amount: number;
  description: string;
}
