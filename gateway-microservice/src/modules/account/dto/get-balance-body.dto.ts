import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetBalanceBodyDto {
  @ApiProperty({
    description: 'Account number',
    example: 1000001,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  accountNumber: number;
}
