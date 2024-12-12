import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfigService } from './config/typeorm/typeorm.config';
import { MessageModule } from './modules/message/message.module';

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
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
