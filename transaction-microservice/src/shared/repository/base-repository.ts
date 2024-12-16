import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IBaseRepository } from '../interface/base-respository.interface';

@Injectable()
export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(@InjectModel('Base') protected readonly model: Model<T>) {}

  async create(createDto: any): Promise<T> {
    const createdDocument = new this.model(createDto);
    return createdDocument.save();
  }

  async findAll(
    filter: FilterQuery<T> = {},
    options: QueryOptions = {},
  ): Promise<T[]> {
    return this.model.find(filter, null, options).exec();
  }

  async findOne(
    filter: FilterQuery<T>,
    options: QueryOptions = {},
  ): Promise<T | null> {
    return this.model.findOne(filter, null, options).exec();
  }

  async findById(id: string, options: QueryOptions = {}): Promise<T | null> {
    return this.model.findById(id, null, options).exec();
  }

  async update(id: string, updateDto: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async softDelete(id: string): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), active: false },
        { new: true },
      )
      .exec();
  }

  async restore(id: string): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, { deletedAt: null, active: true }, { new: true })
      .exec();
  }
}
