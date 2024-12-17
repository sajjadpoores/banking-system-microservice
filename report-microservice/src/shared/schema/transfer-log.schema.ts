import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseCustomSchema } from './base.schema';
import { TransferType } from '../enum/transfer-type.enum';
import { TransactionStatus } from '../enum/transaction-status.enum';

export type TransferLogDocument = HydratedDocument<TransferLog>;

@Schema({ timestamps: true })
export class TransferLog extends BaseCustomSchema {
  @Prop({ type: String, required: false })
  transferNumber: string;

  @Prop({ type: Number, required: true })
  destinationAccount: number;

  @Prop({ type: Number, required: false })
  sourceAccount: number;

  @Prop({ type: String, required: false })
  sourceUserId: string;

  @Prop({ type: String, required: false })
  destinationUserId: string;

  @Prop({ type: Number, required: false })
  sourceBalance: number;

  @Prop({ type: Number, required: false })
  destinationBalance: number;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, enum: TransferType, required: true })
  type: TransferType;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: String, required: true, enum: TransactionStatus })
  status: TransactionStatus;
}

export const TransferLogSchema = SchemaFactory.createForClass(TransferLog);
