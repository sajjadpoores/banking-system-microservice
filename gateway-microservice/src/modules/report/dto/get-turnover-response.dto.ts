import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from 'src/shared/enum/transaction-status.enum';
import { TurnoverType } from 'src/shared/enum/turnover-type.enum';

export class GetTurnoverResponseDto {
  @ApiProperty({
    description: 'Transaction number',
    example: 'TXN1234567890',
    type: String,
  })
  transactionNumber: string;

  @ApiProperty({
    description: 'Account number',
    example: 1000001,
    type: Number,
  })
  accountNumber: number;

  @ApiProperty({
    description: 'Transaction type',
    example: TurnoverType.DEPOSIT,
    enum: TurnoverType,
  })
  type: TurnoverType;

  @ApiProperty({
    description: 'Transaction amount',
    example: 50000,
    type: Number,
  })
  amount: number;

  @ApiProperty({
    description: 'Transaction date',
    example: '2024-06-15T14:48:00Z',
    type: String,
  })
  transactionDate: string;

  @ApiProperty({
    description: 'Transaction description',
    example: 'June salary deposit',
    type: String,
  })
  description: string;

  @ApiProperty({
    type: String,
    enum: TransactionStatus,
    description: 'Payment status',
    example: TransactionStatus.PENDING,
  })
  status: TransactionStatus;
}
