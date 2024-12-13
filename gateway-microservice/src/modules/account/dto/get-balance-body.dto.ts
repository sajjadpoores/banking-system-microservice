import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetBalanceBodyDto {
  @ApiProperty({
    description: 'شماره حساب',
    example: 1000001,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  accountNumber: number;
}
