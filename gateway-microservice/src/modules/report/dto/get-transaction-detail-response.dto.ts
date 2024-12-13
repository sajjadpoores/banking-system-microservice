import { ApiProperty } from '@nestjs/swagger';
import { TransferType } from 'src/shared/enum/transfer-type.enum';

export class GetTransactionDetailResponseDto {
  @ApiProperty({
    description: 'شماره تراکنش',
    example: 'TXN1234567890',
    type: String,
  })
  transactionNumber: string;

  @ApiProperty({
    description: 'شماره حساب مبدا',
    example: 1000001,
    type: Number,
    nullable: true,
  })
  sourceAccountNumber?: number;

  @ApiProperty({
    description: 'شماره حساب مقصد',
    example: 1000002,
    type: Number,
  })
  destinationAccountNumber: number;

  @ApiProperty({
    description: 'نوع انتقال',
    example: TransferType.TRANSFER,
    enum: TransferType,
  })
  transferType: TransferType;

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
}
