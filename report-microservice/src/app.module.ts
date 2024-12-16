import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { MongooseConfigService } from './config/mongoose/mongoose.config';
import { ReportModule } from './modules/report/report.module';
import { logModule } from './modules/log/log.module';

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
    logModule,
    ReportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
