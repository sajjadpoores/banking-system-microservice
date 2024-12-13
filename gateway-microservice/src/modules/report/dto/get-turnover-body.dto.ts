// src/report/dto/get-turnover.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { TurnoverType } from 'src/shared/enum/turnover-type.enum';

export class GetTurnoverQueryDto {
  @ApiProperty({
    description: 'شماره حساب',
    example: 1000001,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  accountNumber: number;

  @ApiPropertyOptional({
    description: 'تاریخ شروع تراکنش (ISO 8601)',
    example: '2024-01-01T00:00:00Z',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'تاریخ پایان تراکنش (ISO 8601)',
    example: '2024-12-31T23:59:59Z',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'حداقل مبلغ تراکنش',
    example: 1000,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  minAmount?: number;

  @ApiPropertyOptional({
    description: 'حداکثر مبلغ تراکنش',
    example: 100000,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  maxAmount?: number;

  @ApiPropertyOptional({
    description: 'نوع تراکنش',
    example: TurnoverType.DEPOSIT,
    enum: TurnoverType,
  })
  @IsEnum(TurnoverType)
  @IsOptional()
  type?: TurnoverType;
}
