import { MigrationInterface, QueryRunner } from 'typeorm';

export class OutboxEntity1734041505039 implements MigrationInterface {
  name = 'OutboxEntity1734041505039';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "outbox" ("id" SERIAL NOT NULL, "aggregateId" character varying NOT NULL, "type" character varying NOT NULL, "payload" json NOT NULL, "processed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "outbox"`);
  }
}
