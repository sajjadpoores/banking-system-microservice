import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitMqClientService } from 'src/config/rabbitmq/rabbitmq-client.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: async (configService: ConfigService) =>
            new RabbitMqClientService(
              configService,
              'transaction_queue',
            ).createClientOptions(),
          inject: [ConfigService],
          name: 'transaction_broker',
        },
      ],
    }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
