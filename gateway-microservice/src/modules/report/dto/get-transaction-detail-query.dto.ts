import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetTransactionDetailQueryDto {
  @ApiProperty({
    description: 'شماره تراکنش',
    example: '1234567890',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  transactionNumber: string;
}
