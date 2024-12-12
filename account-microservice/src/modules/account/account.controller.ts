import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccountService } from './account.service';
import { CreateAccountBodyDto } from './dto/create-account-body.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly _accountService: AccountService) {}

  @MessagePattern('account.create')
  async handleCreateAccount(@Payload() payload: CreateAccountBodyDto) {
    return this._accountService.createAccount(payload);
  }
}
