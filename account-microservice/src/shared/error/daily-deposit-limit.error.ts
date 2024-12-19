import { RpcException } from '@nestjs/microservices';

export class DailyDepositLimitExceededException extends RpcException {
  constructor(limit: number) {
    super({
      status: 'FAILED',
      message: `Daily deposit limit of ${limit} exceeded.`,
      data: null,
    });
  }
}
