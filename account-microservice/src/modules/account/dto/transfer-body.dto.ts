export class TransferBodyDto {
  sourceAccountNumber: number;
  destinationAccountNumber: number;
  transactionNumber: string;
  amount: number;
  description: string;
}
