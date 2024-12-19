import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { CreateAccountReponseDto } from './dto/create-account-response.dto';
import { DepositBodyDto } from './dto/deposit-body.dto';
import { DepositResponseDto } from './dto/deposit-response.dto';
import { GetBalanceResponseDto } from './dto/get-balance-response.dto';
import { GetBalanceBodyDto } from './dto/get-balance-body.dto';
import { RequireAccountAccess } from 'src/shared/decorator/require-account-access.decorator';
import { User } from 'src/shared/decorator/user.decorator';
import { IUser } from 'src/shared/interface/user.interface';

@Controller('account')
@ApiTags('Account')
@ApiBearerAuth()
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
    @User() user: IUser,
  ): Promise<ResponseModel<CreateAccountReponseDto>> {
    return this._accountService.createAccount(user);
  }

  @Post('deposit')
  @RequireAccountAccess('accountNumber')
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
  @RequireAccountAccess('accountNumber')
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
