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
import { withdrawResponseDto } from './dto/withdraw-response';
import { withdrawBodyDto } from './dto/withdraw-body.dto';

@Controller('account')
@ApiTags('Account')
@ApiBearerAuth()
export class AccountController {
  constructor(private readonly _accountService: AccountService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiOkResponse({
    status: 201,
    description: 'Account created successfully.',
    type: ResponseModel<CreateAccountReponseDto>,
  })
  async createAccount(
    @User() user: IUser,
  ): Promise<ResponseModel<CreateAccountReponseDto>> {
    return this._accountService.createAccount(user);
  }

  @Post('deposit')
  @RequireAccountAccess('accountNumber')
  @ApiOperation({ summary: 'Increase account balance' })
  @ApiOkResponse({
    status: 200,
    description: 'Account balance increased successfully.',
    type: ResponseModel<DepositResponseDto>,
  })
  async deposit(
    @Body() payload: DepositBodyDto,
  ): Promise<ResponseModel<DepositResponseDto>> {
    return this._accountService.deposit(payload);
  }

  @Post('withdraw')
  @RequireAccountAccess('accountNumber')
  @ApiOperation({ summary: 'Withdraw from account' })
  @ApiOkResponse({
    status: 200,
    description: 'Withdrawal from account completed successfully.',
    type: ResponseModel<withdrawResponseDto>,
  })
  async withdraw(
    @Body() payload: withdrawBodyDto,
  ): Promise<ResponseModel<withdrawResponseDto>> {
    return this._accountService.withdraw(payload);
  }

  @Post('balance')
  @RequireAccountAccess('accountNumber')
  @ApiOperation({ summary: 'Get account balance' })
  @ApiOkResponse({
    status: 200,
    description: 'Account balance retrieved successfully.',
    type: ResponseModel<GetBalanceResponseDto>,
  })
  async getBalance(
    @Body() payload: GetBalanceBodyDto,
  ): Promise<ResponseModel<GetBalanceResponseDto>> {
    return this._accountService.getBalance(payload);
  }
}
