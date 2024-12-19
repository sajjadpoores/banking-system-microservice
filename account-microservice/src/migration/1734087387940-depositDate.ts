import { MigrationInterface, QueryRunner } from 'typeorm';

export class DepositDate1734087387940 implements MigrationInterface {
  name = 'DepositDate1734087387940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ADD "lastDepositDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD "todayDepositSum" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP COLUMN "todayDepositSum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP COLUMN "lastDepositDate"`,
    );
  }
}
