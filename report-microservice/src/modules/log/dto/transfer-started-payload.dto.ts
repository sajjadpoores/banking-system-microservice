export class TransferStartedPayloadDto {
  transactionNumber: string;
  sourceAccountNumber: number;
  destinationAccountNumber: number;
  amount: number;
  description: string;
}
