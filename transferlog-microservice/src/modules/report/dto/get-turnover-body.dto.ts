import { TurnoverType } from 'src/shared/enum/turnover-type.enum';

export class GetTurnoverQueryDto {
  accountNumber: number;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  type?: TurnoverType;
}
