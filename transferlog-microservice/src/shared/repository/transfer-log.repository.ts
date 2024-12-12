import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base-repository';
import {
  TransferLog,
  TransferLogDocument,
} from '../schema/transfer-log.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TransferLogRepository extends BaseRepository<TransferLogDocument> {
  constructor(
    @InjectModel(TransferLog.name) model: Model<TransferLogDocument>,
  ) {
    super(model);
  }
}
