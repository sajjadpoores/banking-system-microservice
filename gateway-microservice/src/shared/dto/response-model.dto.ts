import { ApiProperty } from '@nestjs/swagger';
import { ReponseStatus } from '../enum/response-status.enum';

export class ResponseModel<T> {
  @ApiProperty({ enum: ReponseStatus, description: 'Status of the response' })
  status: ReponseStatus;

  @ApiProperty({ description: 'Message providing additional details' })
  message: string;

  @ApiProperty({
    description: 'Data payload',
  })
  data: T | T[];
}
