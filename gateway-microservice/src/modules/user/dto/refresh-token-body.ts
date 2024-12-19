import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenBodyDto {
  @ApiProperty({
    description: 'Refresh token (JWT)',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsInVzZXJJZCI6IjA3MjA1MDA0OTQiLCJpYXQiOjE3MzQ2MDI0MDgsImV4cCI6MTczNTIwNzIwOH0.nnGSkkuBMWE7H4-B1DucMpgEl8nGbonTRCmLxcF1OTc',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
