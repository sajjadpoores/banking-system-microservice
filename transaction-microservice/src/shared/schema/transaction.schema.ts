import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseCustomSchema } from './base.schema';

export type TransactionLogDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction extends BaseCustomSchema {
  @Prop({ type: String, required: true })
  transactionNumber: string;

  @Prop({ type: Number, required: true })
  destinationAccountNumber: number;

  @Prop({ type: Number, required: true })
  sourceAccountNumber: number;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: Boolean, required: true, default: false })
  processed: boolean;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
