import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAccountBodyDto } from './dto/create-account-body.dto';
import { CreateAccountReponseDto } from './dto/create-account-response.dto';
import { firstValueFrom } from 'rxjs';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { TransferBodyDto } from './dto/transfer-body.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';
import { DepositBodyDto } from './dto/deposit-body.dto';
import { DepositResponseDto } from './dto/deposit-response.dto';

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

  async transfer(
    payload: TransferBodyDto,
  ): Promise<ResponseModel<TransferResponseDto>> {
    return firstValueFrom(
      this._rabbitmqClient.send<ResponseModel<any>>(
        'account.transfer',
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
}
