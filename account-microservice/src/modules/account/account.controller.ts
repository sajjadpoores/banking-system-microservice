import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccountService } from './account.service';
import { CreateAccountBodyDto } from './dto/create-account-body.dto';
import { TransferBodyDto } from './dto/transfer-body.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { CreateAccountReponseDto } from './dto/create-account-response.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';
import { DepositBodyDto } from './dto/deposit-body.dto';
import { DepositResponseDto } from './dto/deposit-response.dto';
import { GetBalanceResponseDto } from './dto/get-balance-response.dto';
import { GetBalanceBodyDto } from './dto/get-balance-body.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly _accountService: AccountService) {}

  @MessagePattern('account.create')
  async handleCreateAccount(
    @Payload() payload: CreateAccountBodyDto,
  ): Promise<ResponseModel<CreateAccountReponseDto>> {
    return this._accountService.createAccount(payload);
  }

  @MessagePattern('account.transfer')
  async transfer(
    @Payload() payload: TransferBodyDto,
  ): Promise<ResponseModel<TransferResponseDto>> {
    return this._accountService.transfer(payload);
  }

  @MessagePattern('account.deposit')
  async handleDeposit(
    @Payload() payload: DepositBodyDto,
  ): Promise<ResponseModel<DepositResponseDto>> {
    return this._accountService.deposit(payload);
  }

  @MessagePattern('account.getBalance')
  async handleGetBalance(
    @Payload() payload: GetBalanceBodyDto,
  ): Promise<ResponseModel<GetBalanceResponseDto>> {
    return this._accountService.getBalance(payload);
  }
}
