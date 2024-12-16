import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from 'src/shared/enum/transaction-status.enum';
import { TurnoverType } from 'src/shared/enum/turnover-type.enum';

export class GetTurnoverResponseDto {
  @ApiProperty({
    description: 'شماره تراکنش',
    example: 'TXN1234567890',
    type: String,
  })
  transactionNumber: string;

  @ApiProperty({
    description: 'شماره حساب',
    example: 1000001,
    type: Number,
  })
  accountNumber: number;

  @ApiProperty({
    description: 'نوع تراکنش',
    example: TurnoverType.DEPOSIT,
    enum: TurnoverType,
  })
  type: TurnoverType;

  @ApiProperty({
    description: 'مبلغ تراکنش',
    example: 50000,
    type: Number,
  })
  amount: number;

  @ApiProperty({
    description: 'تاریخ تراکنش',
    example: '2024-06-15T14:48:00Z',
    type: String,
  })
  transactionDate: string;

  @ApiProperty({
    description: 'توضیحات تراکنش',
    example: 'واریز حقوق ماه ژوئن',
    type: String,
  })
  description: string;

  @ApiProperty({
    type: String,
    enum: TransactionStatus,
    description: 'وضعیت پرداخت',
    example: TransactionStatus.PENDING,
  })
  status: TransactionStatus;
}
