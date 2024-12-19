// src/account/dto/get-balance-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class GetBalanceResponseDto {
  @ApiProperty({
    description: 'Account number',
    example: 1000001,
    type: Number,
  })
  accountNumber: number;

  @ApiProperty({
    type: Number,
    description: 'Account balance',
    example: 500000,
  })
  balance: number;
}
