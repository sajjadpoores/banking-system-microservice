import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountReponseDto {
  @ApiProperty({
    description: 'Account number',
    example: 1000001,
    type: String,
  })
  accountNumber: number;

  @ApiProperty({
    description: 'Account balance',
    example: 20000000,
    type: Number,
  })
  balance: number;
}
