import { Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/shared/repository/account.repository';
import { CreateAccountBodyDto } from './dto/create-account-body.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { ReponseStatus } from 'src/shared/enum/response-status.enum';
import { CreateAccountReponseDto } from './dto/create-account-response.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';
import { ConfigService } from '@nestjs/config';
import { TransferBodyDto } from './dto/transfer-body.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly _accountRepository: AccountRepository,
    private readonly _configService: ConfigService,
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
    let result;
    if (
      payload.amount < this._configService.get<number>('EASY_TRANSFER_LIMIT')
    ) {
      result = await this._accountRepository.easyTransfer(payload);
    } else {
      result = await this._accountRepository.hardTransfer(payload);
    }
    return {
      status: ReponseStatus.SUCESS,
      message: 'Transfer successfully done.',
      data: {
        balance: result.balance,
      },
    };
  }
}
