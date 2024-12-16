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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [CounterRepository, TransactionRepository, TransactionService],
})
export class TransactionModule {}
