import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccountService } from './account.service';
import { CreateAccountBodyDto } from './dto/create-account-body.dto';
import { TransferBodyDto } from './dto/transfer-body.dto';
import { ResponseModel } from 'src/shared/dto/response-model.dto';
import { CreateAccountReponseDto } from './dto/create-account-response.dto';
import { TransferResponseDto } from './dto/transfer-response.dto';

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
}
