import { Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/shared/repository/account.repository';
import { CreateAccountBodyDto } from './dto/create-account-body.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { ReponseStatus } from 'src/shared/enum/response-status.enum';
import { CreateAccountReponseDto } from './dto/create-account-response.dto';

@Injectable()
export class AccountService {
  constructor(private readonly _accountRepository: AccountRepository) {}

  async createAccount(
    payload: CreateAccountBodyDto,
  ): Promise<ResponseModel<CreateAccountReponseDto>> {
    const account = await this._accountRepository.save({
      userId: payload.userId,
      balance: 20000000,
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
}
