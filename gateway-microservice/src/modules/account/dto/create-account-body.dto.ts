import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, Length } from 'class-validator';
import { IsIranianNationalCode } from '../decorator/iranian-national-code-validator.decorator';

export class CreateAccountBodyDto {
  @IsString()
  @Length(10)
  @IsNumberString()
  @IsIranianNationalCode({ message: 'The entered national ID is invalid.' })
  @ApiProperty({
    description: 'National ID',
    example: '0720500494',
    type: String,
  })
  userId: string;
}
