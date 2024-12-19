import { RpcException } from '@nestjs/microservices';

export class InsufficientBalanceException extends RpcException {
  constructor() {
    super({
      status: 'FAILED',
      message: 'Insufficient balance in the account.',
      data: null,
    });
  }
}
