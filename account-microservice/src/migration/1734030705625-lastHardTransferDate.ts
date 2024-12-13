import { MigrationInterface, QueryRunner } from 'typeorm';

export class LastHardTransferDate1734030705625 implements MigrationInterface {
  name = 'LastHardTransferDate1734030705625';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" ADD "lastHardTransferDate" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP COLUMN "lastHardTransferDate"`,
    );
  }
}
