import { Module } from '@nestjs/common';
import { OutboxService } from './outbox.service';
import { OutboxRepository } from 'src/shared/repository/outbox.repository';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitMqClientService } from 'src/config/rabbitmq/rabbitmq-client.config';
import { ConfigService } from '@nestjs/config';
import { OutboxProcessor } from './outbox.cron';

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
  providers: [OutboxService, OutboxRepository, OutboxProcessor],
})
export class OutboxModule {}
