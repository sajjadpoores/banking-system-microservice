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

@Injectable()
export class AccountService {
  constructor(
    @Inject('account_broker')
    private readonly _rabbitmqClient: ClientProxy,
  ) {}

  async createAccount(
    payload: CreateAccountBodyDto,
  ): Promise<ResponseModel<CreateAccountReponseDto>> {
    return firstValueFrom(
      this._rabbitmqClient.send<ResponseModel<CreateAccountReponseDto>>(
        'account.create',
        payload,
      ),
    );
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
