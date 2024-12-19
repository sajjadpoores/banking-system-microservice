import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { MongooseConfigService } from './config/mongoose/mongoose.config';
import { TransactionModule } from './modules/transaction/transaction.module';
import { OutboxModule } from './outbox/outbox.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(
        __dirname,
        '../env/',
        `${process.env.NODE_ENV || 'development'}.env`,
      ),
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    TransactionModule,
    OutboxModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
