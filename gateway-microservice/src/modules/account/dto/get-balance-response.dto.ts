// src/account/dto/get-balance-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class GetBalanceResponseDto {
  @ApiProperty({
    description: 'شماره حساب',
    example: 1000001,
    type: Number,
  })
  accountNumber: number;

  @ApiProperty({
    type: Number,
    description: 'موجودی حساب',
    example: 500000,
  })
  balance: number;
}
