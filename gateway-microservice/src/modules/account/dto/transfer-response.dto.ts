import { ApiProperty } from '@nestjs/swagger';

export class TransferResponseDto {
  @ApiProperty({
    description: 'موجودی حساب',
  })
  balance: number;
}
