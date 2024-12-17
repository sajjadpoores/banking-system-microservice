import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly _configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this._configService.get<string>('MONGODB_URI'),
    };
  }
}
