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
  @IsIranianNationalCode({ message: 'شماره ملی وارد شده صحیح نمی‌باشد' })
  @ApiProperty({
    description: 'شماره ملی',
    example: '0720500494',
    type: String,
  })
  userId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'نام کاربر',
    example: 'Ali Rezaei',
    type: String,
  })
  name: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' })
  @Matches(/[A-Z]/, {
    message: 'رمز عبور باید حداقل شامل یک حرف بزرگ باشد',
  })
  @Matches(/[a-z]/, {
    message: 'رمز عبور باید حداقل شامل یک حرف کوچک باشد',
  })
  @Matches(/\d/, {
    message: 'رمز عبور باید حداقل شامل یک عدد باشد',
  })
  @Matches(/[@$!%*?&#]/, {
    message: 'رمز عبور باید حداقل شامل یک کاراکتر خاص باشد (@$!%*?&#)',
  })
  @ApiProperty({
    description:
      'رمز عبور - حداقل ۸ کاراکتر، شامل حداقل یک حرف بزرگ، یک حرف کوچک، یک عدد و یک کاراکتر خاص',
    example: 'Password@123',
    type: String,
  })
  password: string;
}
