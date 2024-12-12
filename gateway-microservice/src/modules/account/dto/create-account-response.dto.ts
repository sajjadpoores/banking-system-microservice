import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountReponseDto {
  @ApiProperty({
    description: 'شماره حساب',
    example: 1000001,
    type: String,
  })
  accountNumber: number;

  @ApiProperty({
    description: 'موجودی حساب',
    example: 20000000,
    type: Number,
  })
  balance: number;
}
