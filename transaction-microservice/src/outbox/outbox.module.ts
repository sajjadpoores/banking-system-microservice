import { Module } from '@nestjs/common';
import { OutboxService } from './outbox.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionSchema,
} from 'src/shared/schema/transaction.schema';
import { OutboxProcessor } from './outbox.cron';
import { TransactionRepository } from 'src/shared/repository/transaction-repository';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RabbitMqClientService } from 'src/config/mongoose/rabbitmq/rabbitmq-client.config';

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
          name: 'transaction_broker',
        },
      ],
    }),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [TransactionRepository, OutboxService, OutboxProcessor],
})
export class OutboxModule {}
