import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'شماره ملی',
    example: '0720500494',
    type: String,
  })
  userId: string;

  @ApiProperty({
    description: 'User name',
    example: 'Amir Sajjad',
    type: String,
  })
  name: string;
}