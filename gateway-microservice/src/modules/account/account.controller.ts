import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CreateAccountBodyDto } from './dto/create-account-body.dto copy';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { CreateAccountReponseDto } from './dto/create-account-response.dto';

@Controller('account')
@ApiTags('Account')
export class AccountController {
  constructor(private readonly _accountService: AccountService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new Account' })
  @ApiOkResponse({
    status: 201,
    description: 'The account created',
    type: ResponseModel<CreateAccountReponseDto>,
  })
  async createAccount(
    @Body() payload: CreateAccountBodyDto,
  ): Promise<ResponseModel<CreateAccountReponseDto>> {
    return this._accountService.createAccount(payload);
  }
}
