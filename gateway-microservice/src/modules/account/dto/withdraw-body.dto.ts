import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class withdrawBodyDto {
  @ApiProperty({
    description: 'شناسه حساب',
    example: 1000001,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  accountNumber: number;

  @ApiProperty({
    type: Number,
    description: 'مبلغ برداشتی',
    example: 100000,
  })
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  amount: number;
}
