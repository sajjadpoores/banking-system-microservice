import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAccountBodyDto } from './dto/create-account-body.dto copy';
import { CreateAccountReponseDto } from './dto/create-account-response.dto';
import { firstValueFrom } from 'rxjs';
import { ResponseModel } from 'src/shared/dto/response-model.dto';

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
}
