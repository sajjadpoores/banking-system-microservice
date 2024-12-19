import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { IsIranianNationalCode } from 'src/modules/account/decorator/iranian-national-code-validator.decorator';

export class CreateUserDto {
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

  @IsNotEmpty()
  @ApiProperty({
    description: 'User name',
    example: 'Ali Rezaei',
    type: String,
  })
  name: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'The password must be at least 8 characters long.' })
  @Matches(/[A-Z]/, {
    message: 'The password must include at least one uppercase letter.',
  })
  @Matches(/[a-z]/, {
    message: 'The password must include at least one lowercase letter.',
  })
  @Matches(/\d/, {
    message: 'The password must include at least one number.',
  })
  @Matches(/[@$!%*?&#]/, {
    message:
      'The password must include at least one special character (@$!%*?&#).',
  })
  @ApiProperty({
    description:
      'Password - at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character',
    example: 'Password@123',
    type: String,
  })
  password: string;
}
