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
  userId: string;

  @ApiProperty({
    type: Number,
    description: 'Source account number',
    example: 1000001,
  })
  @IsNumber()
  @IsNotEmpty()
  sourceAccountNumber: number;

  @ApiProperty({
    type: Number,
    description: 'Destination account number',
    example: 1000002,
  })
  @IsNumber()
  @IsNotEmpty()
  destinationAccountNumber: number;

  @ApiProperty({
    type: Number,
    description: 'Amount',
    example: 10000,
  })
  @IsNotEmpty()
  @IsPositive()
  @Max(100000000, {
    message: 'The maximum transferable amount is 100 million rials.',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Description',
    example: 'Payment for previous debt',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string;
}
