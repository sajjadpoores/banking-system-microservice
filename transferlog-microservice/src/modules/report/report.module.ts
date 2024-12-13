import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransferLog,
  TransferLogSchema,
} from 'src/shared/schema/transfer-log.schema';
import { TransferLogRepository } from 'src/shared/repository/transfer-log.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransferLog.name, schema: TransferLogSchema },
    ]),
  ],
  providers: [TransferLogRepository, ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
