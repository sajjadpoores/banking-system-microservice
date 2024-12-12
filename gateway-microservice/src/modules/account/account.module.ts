import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RabbitMqClientService } from 'src/config/rabbitmq-client.config';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: async (configService: ConfigService) =>
            new RabbitMqClientService(
              configService,
              'account_queue',
            ).createClientOptions(),
          inject: [ConfigService],
          name: 'account_broker',
        },
      ],
    }),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
