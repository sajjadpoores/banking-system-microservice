import { Module } from '@nestjs/common';
import { TransferLogService } from './transfer-log.service';
import { TransferLogController } from './transfer-log.controller';
import { TransferLogRepository } from 'src/shared/repository/transfer-log.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransferLog,
  TransferLogSchema,
} from 'src/shared/schema/transfer-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransferLog.name, schema: TransferLogSchema },
    ]),
  ],
  providers: [TransferLogRepository, TransferLogService],
  controllers: [TransferLogController],
})
export class TransferLogModule {}
