export class TransferStartedPayloadDto {
  sourceUserId: string;
  transactionNumber: string;
  sourceAccountNumber: number;
  destinationAccountNumber: number;
  amount: number;
  description: string;
}
