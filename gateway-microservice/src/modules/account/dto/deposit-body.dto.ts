import { IsNotEmpty, IsNumber, IsPositive, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepositBodyDto {
  @ApiProperty({
    description: 'Account identifier',
    example: 1000001,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  accountNumber: number;

  @ApiProperty({
    type: Number,
    description: 'Deposit amount',
    example: 100000,
  })
  @IsNotEmpty()
  @IsPositive()
  @Max(100000000, {
    message: 'The maximum transferable amount is 100 million rials.',
  })
  @IsNumber()
  amount: number;
}
