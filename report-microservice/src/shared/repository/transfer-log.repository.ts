import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base-repository';
import {
  TransferLog,
  TransferLogDocument,
} from '../schema/transfer-log.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetTurnoverQueryDto } from 'src/modules/report/dto/get-turnover.dto';
import { TurnoverType } from '../enum/turnover-type.enum';
import { TransactionStatus } from '../enum/transaction-status.enum';
import { TransferType } from '../enum/transfer-type.enum';

@Injectable()
export class TransferLogRepository extends BaseRepository<TransferLogDocument> {
  constructor(
    @InjectModel(TransferLog.name) model: Model<TransferLogDocument>,
  ) {
    super(model);
  }

  async getTurnover(filters: GetTurnoverQueryDto): Promise<TransferLog[]> {
    const query: any = {
      status: TransactionStatus.DONE,
    };

    if (filters.type === TurnoverType.DEPOSIT) {
      query.$or = [
        { type: TransferType.GIFT, destinationAccount: filters.accountNumber },
        {
          type: TransferType.DEPOSIT,
          destinationAccount: filters.accountNumber,
        },
        {
          type: TransferType.TRANSFER,
          destinationAccount: filters.accountNumber,
        },
        {
          type: TransferType.HARD_TRANSFER,
          destinationAccount: filters.accountNumber,
        },
      ];
    } else if (filters.type === TurnoverType.WITHDRAWAL) {
      query.$or = [
        {
          type: TransferType.WITHDRAWAL,
          destinationAccount: filters.accountNumber,
        },
        {
          type: TransferType.TRANSFER,
          sourceAccount: filters.accountNumber,
        },
        {
          type: TransferType.HARD_TRANSFER,
          sourceAccount: filters.accountNumber,
        },
      ];
    } else {
      query.$or = [
        { sourceAccount: filters.accountNumber },
        { destinationAccount: filters.accountNumber },
      ];
    }

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.date.$lte = new Date(filters.endDate);
      }
    }

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      query.amount = {};
      if (filters.minAmount !== undefined) {
        query.amount.$gte = filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        query.amount.$lte = filters.maxAmount;
      }
    }

    return this.model.find(query).exec();
  }

  async findByTransactionNumber(
    transactionNumber: string,
  ): Promise<TransferLog | null> {
    return this.model.findOne({ transferNumber: transactionNumber }).exec();
  }
}
