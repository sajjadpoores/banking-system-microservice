import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1733997720369 implements MigrationInterface {
    name = 'Initial1733997720369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account" ("createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(0) with time zone, "deletedAt" TIMESTAMP, "active" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "userId" character varying NOT NULL, "accountNumber" bigint NOT NULL, "balance" bigint NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "account"`);
    }

}
