import { IsNotEmpty, IsNumber, IsPositive, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepositBodyDto {
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
    description: 'مبلغ واریزی',
    example: 100000,
  })
  @IsNotEmpty()
  @IsPositive()
  @Max(100000000, {
    message: 'ماکزیموم مبلغ قابل انتقال 100 میلیون ریال می‌باشد.',
  })
  @IsNumber()
  amount: number;
}
