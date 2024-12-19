import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfigService } from './config/typeorm/typeorm.config';
import { AccountModule } from './modules/account/account.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OutboxModule } from './modules/outbox/outbox.module';

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
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ScheduleModule.forRoot(),
    AccountModule,
    OutboxModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
