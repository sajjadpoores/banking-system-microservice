import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from 'src/shared/enum/transaction-status.enum';

export class TransferResponseDto {
  @ApiProperty({
    type: String,
    description: 'شناسه تراکنش',
    example: '1234567890',
  })
  transactionNumber: string;

  @ApiProperty({
    type: String,
    enum: TransactionStatus,
    description: 'وضعیت پرداخت',
    example: TransactionStatus.PENDING,
  })
  transactionStatus: TransactionStatus;
}
