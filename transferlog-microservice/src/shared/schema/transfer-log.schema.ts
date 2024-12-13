import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseCustomSchema } from './base.schema';
import { TransferType } from '../enum/transfer-type.enum';

export type TransferLogDocument = HydratedDocument<TransferLog>;

@Schema({ timestamps: true })
export class TransferLog extends BaseCustomSchema {
  @Prop({ type: Number, required: false })
  transferNumber: number;

  @Prop({ type: Number, required: true })
  destinationAccount: number;

  @Prop({ type: Number, required: false })
  sourceAccount: number;

  @Prop({ type: String, required: false })
  sourceUserId: string;

  @Prop({ type: String, required: true })
  destinationUserId: string;

  @Prop({ type: Number, required: false })
  sourceBalance: number;

  @Prop({ type: Number, required: true })
  destinationBalance: number;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, enum: TransferType, required: true })
  type: TransferType;
}

export const TransferLogSchema = SchemaFactory.createForClass(TransferLog);
