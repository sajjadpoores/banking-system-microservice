import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter, CounterDocument } from 'src/shared/schema/counter.schema';
import { BaseRepository } from './base-repository';

@Injectable()
export class CounterRepository extends BaseRepository<CounterDocument> {
  constructor(@InjectModel(Counter.name) model: Model<CounterDocument>) {
    super(model);
  }

  async getNextTransactionNumber(): Promise<string> {
    const result = await this.model
      .findOneAndUpdate(
        { key: 'transactionNumber' },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true },
      )
      .exec();

    const transactionNumber = `${String(result.sequence_value).padStart(9, '0')}`;
    return transactionNumber;
  }
}
