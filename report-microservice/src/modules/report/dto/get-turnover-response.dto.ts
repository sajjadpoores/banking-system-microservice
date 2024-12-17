import { TransactionStatus } from 'src/shared/enum/transaction-status.enum';
import { TurnoverType } from 'src/shared/enum/turnover-type.enum';

export class GetTurnoverResponseDto {
  transactionNumber: string;
  sourceAccoutNumber: number;
  destinationAccountNumber: number;
  type: TurnoverType;
  amount: number;
  balance: number;
  transactionDate: string;
  description: string;
  status: TransactionStatus;
}
