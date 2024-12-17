import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class TransferBodyDto {
  @ApiProperty({
    type: Number,
    description: 'شماره حساب مبدا',
    example: 1000001,
  })
  @IsNumber()
  @IsNotEmpty()
  sourceAccountNumber: number;

  @ApiProperty({
    type: Number,
    description: 'شماره حساب مقصد',
    example: 1000002,
  })
  @IsNumber()
  @IsNotEmpty()
  destinationAccountNumber: number;

  @ApiProperty({
    type: Number,
    description: 'مبلغ',
    example: 10000,
  })
  @IsNotEmpty()
  @IsPositive()
  @Max(100000000, {
    message: 'ماکزیموم مبلغ قابل انتقال 100 میلیون ریال می‌باشد.',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    type: String,
    required: false,
    description: 'توضیحات',
    example: 'پرداخت بدهی قبلی',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string;
}
