import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcExceptionsFilter } from './shared/filter/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: 'transaction_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  app.useGlobalFilters(new RpcExceptionsFilter());

  await app.listen();
}
bootstrap();
