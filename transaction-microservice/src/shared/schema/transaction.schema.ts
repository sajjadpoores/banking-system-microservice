import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseCustomSchema } from './base.schema';

export type TransactionLogDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction extends BaseCustomSchema {
  @Prop({ type: Number, required: true })
  transactionNumber: number;

  @Prop({ type: Number, required: true })
  destinationAccount: number;

  @Prop({ type: Number, required: true })
  sourceAccount: number;

  @Prop({ type: String, required: true })
  sourceUserId: string;

  @Prop({ type: String, required: true })
  destinationUserId: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, required: false })
  description: string;
}

export const TransferLogSchema = SchemaFactory.createForClass(Transaction);
