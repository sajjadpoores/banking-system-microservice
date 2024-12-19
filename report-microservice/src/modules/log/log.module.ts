import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { logController } from './log.controller';
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
  providers: [TransferLogRepository, LogService],
  controllers: [logController],
})
export class logModule {}
