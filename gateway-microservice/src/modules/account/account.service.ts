import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAccountBodyDto } from './dto/create-account-body.dto';
import { CreateAccountReponseDto } from './dto/create-account-response.dto';
import { firstValueFrom } from 'rxjs';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { DepositBodyDto } from './dto/deposit-body.dto';
import { DepositResponseDto } from './dto/deposit-response.dto';
import { GetBalanceBodyDto } from './dto/get-balance-body.dto';
import { GetBalanceResponseDto } from './dto/get-balance-response.dto';
import Redis from 'ioredis';
import { withdrawBodyDto } from './dto/withdraw-body.dto';
import { withdrawResponseDto } from './dto/withdraw-response';

@Injectable()
export class AccountService {
  constructor(
    @Inject('account_broker')
    private readonly _rabbitmqClient: ClientProxy,
    @Inject('REDIS_CLIENT') private readonly _redisClient: Redis,
  ) {}

  async createAccount(
    payload: CreateAccountBodyDto,
  ): Promise<ResponseModel<CreateAccountReponseDto>> {
    const result = await firstValueFrom(
      this._rabbitmqClient.send<ResponseModel<CreateAccountReponseDto>>(
        'account.create',
        payload,
      ),
    );

    const accountNumber = Array.isArray(result?.data)
      ? result.data[0]?.accountNumber
      : result.data?.accountNumber;

    if (accountNumber) {
      await this._redisClient.hset(
        `user:${payload.userId}:accounts`,
        accountNumber.toString(),
        'active',
      );
    }

    return result;
  }

  async deposit(
    payload: DepositBodyDto,
  ): Promise<ResponseModel<DepositResponseDto>> {
    return firstValueFrom(
      this._rabbitmqClient.send<ResponseModel<DepositResponseDto>>(
        'account.deposit',
        payload,
      ),
    );
  }

  async withdraw(
    payload: withdrawBodyDto,
  ): Promise<ResponseModel<withdrawResponseDto>> {
    return firstValueFrom(
      this._rabbitmqClient.send<ResponseModel<withdrawResponseDto>>(
        'account.withdraw',
        payload,
      ),
    );
  }

  async getBalance(
    payload: GetBalanceBodyDto,
  ): Promise<ResponseModel<GetBalanceResponseDto>> {
    return firstValueFrom(
      this._rabbitmqClient.send<ResponseModel<GetBalanceResponseDto>>(
        'account.getBalance',
        payload,
      ),
    );
  }
}
