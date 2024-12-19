import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginBodyDto {
  @IsString()
  @Length(10)
  @IsNotEmpty()
  @ApiProperty({
    description: 'National ID',
    example: '0720500494',
    type: String,
  })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    example: 'Password@123',
    type: String,
  })
  password: string;
}
