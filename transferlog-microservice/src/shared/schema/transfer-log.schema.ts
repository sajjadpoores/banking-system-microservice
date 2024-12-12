import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseCustomSchema } from './base.schema';

export type TransferLogDocument = HydratedDocument<TransferLog>;

@Schema({ timestamps: true })
export class TransferLog extends BaseCustomSchema {
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

  @Prop({ type: Number, required: true })
  date: Date;
}

export const TransferLogSchema = SchemaFactory.createForClass(TransferLog);
