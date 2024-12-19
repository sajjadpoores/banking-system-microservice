import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetTransactionDetailQueryDto {
  @ApiProperty({
    description: 'Transaction number',
    example: '1234567890',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  transactionNumber: string;
}
