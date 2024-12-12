import { ReponseStatus } from '../enum/response-status.enum';

export class ResponseModel<T> {
  status: ReponseStatus;
  message: string;
  data: T;
}
