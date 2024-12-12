import { Type } from 'class-transformer';
import { TransferType } from 'src/shared/enum/transfer-type.enum';

export class TransferDoneBodyDto {
  transferNumber: number;
  type: TransferType;
  destinationAccountNumber: number;
  destinationUserId: string;
  destinationBalance: number;
  sourceAccountNumber: number;
  sourceUserId: string;
  sourceBalance: number;
  amount: number;
  @Type(() => Date)
  transferDate: Date;
  description: string;
}
