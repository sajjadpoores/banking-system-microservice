import { Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(createDto: any): Promise<T>;
  findAll(filter?: FilterQuery<T>, options?: QueryOptions): Promise<T[]>;
  findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null>;
  findById(id: string, options?: QueryOptions): Promise<T | null>;
  update(id: string, updateDto: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  softDelete(id: string): Promise<T | null>;
  restore(id: string): Promise<T | null>;
}
