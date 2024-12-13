import { ApiProperty } from '@nestjs/swagger';

export class TransferResponseDto {
  @ApiProperty({
    type: Number,
    description: 'شناسه تراکنش',
    example: 1234567890,
  })
  transactionNumber: string;

  @ApiProperty({
    type: Number,
    description: 'موجودی حساب',
    example: 100000,
  })
  balance: number;
}
