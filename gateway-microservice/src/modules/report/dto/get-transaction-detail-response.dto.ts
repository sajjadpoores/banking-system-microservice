import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from 'src/shared/enum/transaction-status.enum';
import { TransferType } from 'src/shared/enum/transfer-type.enum';

export class GetTransactionDetailResponseDto {
  @ApiProperty({
    description: 'Transaction number',
    example: 'TXN1234567890',
    type: String,
  })
  transactionNumber: string;

  @ApiProperty({
    description: 'Source account number',
    example: 1000001,
    type: Number,
    nullable: true,
  })
  sourceAccountNumber?: number;

  @ApiProperty({
    description: 'Destination account number',
    example: 1000002,
    type: Number,
  })
  destinationAccountNumber: number;

  @ApiProperty({
    description: 'Transfer type',
    example: TransferType.TRANSFER,
    enum: TransferType,
  })
  transferType: TransferType;

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
