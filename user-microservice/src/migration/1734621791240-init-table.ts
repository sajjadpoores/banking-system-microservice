import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTable1734621791240 implements MigrationInterface {
  name = 'InitTable1734621791240';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, "deletedAt" TIMESTAMP, "active" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "userId" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, CONSTRAINT "UQ_d72ea127f30e21753c9e229891e" UNIQUE ("userId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
