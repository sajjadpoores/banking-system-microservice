import { ApiProperty } from '@nestjs/swagger';

export class withdrawResponseDto {
  @ApiProperty({
    type: Number,
    description: 'Transaction identifier',
    example: 1234567890,
  })
  transactionNumber: string;

  @ApiProperty({
    type: Number,
    description: 'Account balance',
    example: 100000,
  })
  balance: number;
}
