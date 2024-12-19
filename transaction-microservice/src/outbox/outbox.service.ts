import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { TransactionRepository } from 'src/shared/repository/transaction-repository';
import { Transaction } from 'src/shared/schema/transaction.schema';

@Injectable()
export class OutboxService {
  constructor(private readonly _transactionRepository: TransactionRepository) {}

  async getUnprocessedTransactions(): Promise<Transaction[]> {
    return this._transactionRepository.findAll({ processed: false });
  }

  async markProcessed(id: Types.ObjectId): Promise<void> {
    await this._transactionRepository.update(id.toHexString(), {
      $set: { processed: true },
    });
  }
}
