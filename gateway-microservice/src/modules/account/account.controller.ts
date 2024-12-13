import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CreateAccountBodyDto } from './dto/create-account-body.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { CreateAccountReponseDto } from './dto/create-account-response.dto';
import { TransferBodyDto } from './dto/transfer-body.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';
import { DepositBodyDto } from './dto/deposit-body.dto';
import { DepositResponseDto } from './dto/deposit-response.dto';
import { GetBalanceResponseDto } from './dto/get-balance-response.dto';
import { GetBalanceBodyDto } from './dto/get-balance-body.dto';

@Controller('account')
@ApiTags('Account')
export class AccountController {
  constructor(private readonly _accountService: AccountService) {}

  @Post('')
  @ApiOperation({ summary: 'ایجاد یک حساب جدید' })
  @ApiOkResponse({
    status: 201,
    description: 'حساب ایجاد شد.',
    type: ResponseModel<CreateAccountReponseDto>,
  })
  async createAccount(
    @Body() payload: CreateAccountBodyDto,
  ): Promise<ResponseModel<CreateAccountReponseDto>> {
    return this._accountService.createAccount(payload);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'انتقال وجه از یک حساب به حساب دیگر' })
  @ApiOkResponse({
    status: 201,
    description: 'انتقال وجه انجام شد.',
    type: ResponseModel<CreateAccountReponseDto>,
  })
  async transfer(
    @Body() payload: TransferBodyDto,
  ): Promise<ResponseModel<TransferResponseDto>> {
    return this._accountService.transfer(payload);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'افزایش موجودی حساب' })
  @ApiOkResponse({
    status: 200,
    description: 'افزایش موجودی حساب انجام شد.',
    type: ResponseModel<DepositResponseDto>,
  })
  async deposit(
    @Body() payload: DepositBodyDto,
  ): Promise<ResponseModel<DepositResponseDto>> {
    return this._accountService.deposit(payload);
  }

  @Post('balance')
  @ApiOperation({ summary: 'دریافت موجودی حساب' })
  @ApiOkResponse({
    status: 200,
    description: 'موجودی حساب دریافت شد.',
    type: ResponseModel<GetBalanceResponseDto>,
  })
  async getBalance(
    @Body() payload: GetBalanceBodyDto,
  ): Promise<ResponseModel<GetBalanceResponseDto>> {
    return this._accountService.getBalance(payload);
  }
}
