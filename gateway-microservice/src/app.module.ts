import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AccountModule } from './modules/account/account.module';
import { ReportModule } from './modules/report/report.module';
import { TransactionModule } from './modules/transaction/transaction.module';

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
    AccountModule,
    ReportModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
