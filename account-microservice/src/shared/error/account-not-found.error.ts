import { RpcException } from '@nestjs/microservices';

export class AccountNotFoundException extends RpcException {
  constructor(accountNumber: number) {
    super({
      status: 'FAILED',
      message: `Account with number ${accountNumber} not found.`,
      data: null,
    });
  }
}
