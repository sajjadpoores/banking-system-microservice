import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionSchema,
} from 'src/shared/schema/transaction.schema';
import { TransactionRepository } from 'src/shared/repository/transaction-repository';
import { Counter, CounterSchema } from 'src/shared/schema/counter.schema';
import { CounterRepository } from 'src/shared/repository/counter-repository';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitMqClientService } from 'src/config/mongoose/rabbitmq/rabbitmq-client.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: async (configService: ConfigService) =>
            new RabbitMqClientService(
              configService,
              'report_queue',
            ).createClientOptions(),
          inject: [ConfigService],
          name: 'report_broker',
        },
      ],
    }),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [CounterRepository, TransactionRepository, TransactionService],
})
export class TransactionModule {}
