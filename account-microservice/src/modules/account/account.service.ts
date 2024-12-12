import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/shared/repository/account.repository';
import { CreateAccountBodyDto } from './dto/create-account-body.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { ReponseStatus } from 'src/shared/enum/response-status.enum';
import { CreateAccountReponseDto } from './dto/create-account-response.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { TransferBodyDto } from './dto/transfer-body.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly _accountRepository: AccountRepository,
    private readonly _configService: ConfigService,
    @Inject('account_broker')
    private readonly _rabbitmqClient: ClientProxy,
  ) {}

  async createAccount(
    payload: CreateAccountBodyDto,
  ): Promise<ResponseModel<CreateAccountReponseDto>> {
    const account = await this._accountRepository.save({
      userId: payload.userId,
      balance: this._configService.get<number>('INITIAL_ACCOUNT_GIFT'),
    });
    return {
      status: ReponseStatus.SUCESS,
      message: 'account created succesfully',
      data: {
        accountNumber: account.accountNumber,
        balance: account.balance,
      },
    };
  }

  async transfer(
    payload: TransferBodyDto,
  ): Promise<ResponseModel<TransferResponseDto>> {
    if (
      payload.amount < this._configService.get<number>('EASY_TRANSFER_LIMIT')
    ) {
      return this._easyTransfer(payload);
    } else {
      return this._hardTransfer(payload);
    }
  }

  private async _easyTransfer(payload: TransferBodyDto) {
    const transferResult = await this._accountRepository.transfer(
      payload,
      this._rabbitmqClient,
    );

    return {
      status: ReponseStatus.SUCESS,
      message: 'Transfer successfully done.',
      data: {
        balance: transferResult.balance,
      },
    };
  }

  private async _hardTransfer(payload: TransferBodyDto) {
    const transferResult = await this._accountRepository.hardTransfer(
      payload,
      this._rabbitmqClient,
    );

    return {
      status: ReponseStatus.SUCESS,
      message: 'Transfer successfully done.',
      data: {
        balance: transferResult.balance,
      },
    };
  }
}
