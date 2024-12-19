import { RpcException } from '@nestjs/microservices';

export class TransferLimitException extends RpcException {
  constructor(hoursLeft: number) {
    super({
      status: 'FAILED',
      message: `Hard transfer can only be performed once every 4 hours. Please wait ${hoursLeft} more hours.`,
      data: null,
    });
  }
}
