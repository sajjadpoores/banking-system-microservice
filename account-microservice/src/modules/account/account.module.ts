import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from 'src/shared/repository/account.repository';

@Module({
  providers: [AccountRepository, AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
