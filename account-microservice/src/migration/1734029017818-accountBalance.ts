import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountBalance1734029017818 implements MigrationInterface {
  name = 'AccountBalance1734029017818';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "UQ_ee66d482ebdf84a768a7da36b08" UNIQUE ("accountNumber")`,
    );
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "balance"`);
    await queryRunner.query(
      `ALTER TABLE "account" ADD "balance" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "balance"`);
    await queryRunner.query(
      `ALTER TABLE "account" ADD "balance" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "UQ_ee66d482ebdf84a768a7da36b08"`,
    );
  }
}
