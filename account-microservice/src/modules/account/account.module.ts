import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from 'src/shared/repository/account.repository';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RabbitMqClientService } from 'src/config/rabbitmq/rabbitmq-client.config';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: async (configService: ConfigService) =>
            new RabbitMqClientService(
              configService,
              'transfer_queue',
            ).createClientOptions(),
          inject: [ConfigService],
          name: 'account_broker',
        },
      ],
    }),
  ],
  providers: [AccountRepository, AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
