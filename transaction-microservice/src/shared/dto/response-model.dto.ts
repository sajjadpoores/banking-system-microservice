import { ApiProperty } from '@nestjs/swagger';
import { ReponseStatus } from '../enum/response-status.enum';

export class ResponseModel<T> {
  @ApiProperty()
  status: ReponseStatus;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T | T[];
}
