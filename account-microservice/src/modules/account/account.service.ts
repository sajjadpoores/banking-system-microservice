import { Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/shared/repository/account.repository';
import { CreateAccountBodyDto } from './dto/create-account-body.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { ReponseStatus } from 'src/shared/enum/response-status.enum';
import { CreateAccountReponseDto } from './dto/create-account-response.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';
import { ConfigService } from '@nestjs/config';
import { TransferBodyDto } from './dto/transfer-body.dto';
import { DepositBodyDto } from './dto/deposit-body.dto';
import { DepositResponseDto } from './dto/deposit-response.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly _accountRepository: AccountRepository,
    private readonly _configService: ConfigService,
  ) {}

  async createAccount(
    payload: CreateAccountBodyDto,
  ): Promise<ResponseModel<CreateAccountReponseDto>> {
    const result = await this._accountRepository.createAccount(
      payload,
      this._configService.get<number>('INITIAL_ACCOUNT_GIFT'),
    );
    return {
      status: ReponseStatus.SUCESS,
      message: 'account created succesfully',
      data: {
        accountNumber: result.accountNumber,
        balance: result.balance,
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
        transactionNumber: result.transactionNumber,
        balance: result.balance,
      },
    };
  }

  async deposit(
    payload: DepositBodyDto,
  ): Promise<ResponseModel<DepositResponseDto>> {
    const result = await this._accountRepository.deposit(
      payload,
      this._configService.get<number>('DAILY_DEPOSIT_LIMIT'),
    );

    return {
      status: ReponseStatus.SUCESS,
      message: 'Deposit successfully completed.',
      data: {
        transactionNumber: result.transactionNumber,
        balance: result.balance,
      },
    };
  }
}
