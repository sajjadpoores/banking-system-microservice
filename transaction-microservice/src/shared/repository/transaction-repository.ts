import { Model } from 'mongoose';
import {
  Transaction,
  TransactionLogDocument,
} from '../schema/transaction.schema';
import { BaseRepository } from './base-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionRepository extends BaseRepository<TransactionLogDocument> {
  constructor(
    @InjectModel(Transaction.name) model: Model<TransactionLogDocument>,
  ) {
    super(model);
  }

  async findUnprocessedRecords(): Promise<Transaction[]> {
    return await this.model.find({ processed: false }).exec();
  }

  async markAsProcessed(id: string): Promise<void> {
    await this.model
      .updateOne({ _id: id }, { $set: { processed: true } })
      .exec();
  }
}
