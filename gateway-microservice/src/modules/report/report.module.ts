import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitMqClientService } from 'src/config/rabbitmq/rabbitmq-client.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: async (configService: ConfigService) =>
            new RabbitMqClientService(
              configService,
              'transfer_queue',
            ).createClientOptions(),
          inject: [ConfigService],
          name: 'report_broker',
        },
      ],
    }),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
