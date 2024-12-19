import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'National ID',
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
