import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseCustomSchema } from './base.schema';
import { HydratedDocument } from 'mongoose';

export type CounterDocument = HydratedDocument<Counter>;

@Schema({ timestamps: true })
export class Counter extends BaseCustomSchema {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true, default: 0 })
  sequence_value: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
