import { MigrationInterface, QueryRunner } from 'typeorm';

export class Sequence1734000602621 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE account_number_seq START 1000000;`,
    );
    await queryRunner.query(`
      ALTER TABLE account
      ALTER COLUMN "accountNumber"
      SET DEFAULT nextval('account_number_seq');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE account ALTER COLUMN "accountNumber" DROP DEFAULT;`,
    );
    await queryRunner.query(`DROP SEQUENCE account_number_seq;`);
  }
}
