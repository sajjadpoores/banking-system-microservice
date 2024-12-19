import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from 'src/shared/enum/transaction-status.enum';

export class TransferResponseDto {
  @ApiProperty({
    type: String,
    description: 'Transaction identifier',
    example: '1234567890',
  })
  transactionNumber: string;

  @ApiProperty({
    type: String,
    enum: TransactionStatus,
    description: 'Payment status',
    example: TransactionStatus.PENDING,
  })
  transactionStatus: TransactionStatus;
}
