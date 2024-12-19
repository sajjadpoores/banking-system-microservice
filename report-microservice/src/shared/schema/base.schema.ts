import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true }) // Automatically manages createdAt and updatedAt
export class BaseCustomSchema {
  _id: Types.ObjectId;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt?: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt?: Date;

  @Prop({
    type: Date,
    default: null,
    select: false,
  })
  deletedAt?: Date;

  @Prop({
    type: Boolean,
    default: true,
  })
  active: boolean;
}
