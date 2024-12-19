import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'node:path';

dotenv.config({
  path: join(
    __dirname,
    `../../../env/${process.env.NODE_ENV || 'development'}.env`,
  ),
});

const config = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migration/**/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',
});

export default config;
