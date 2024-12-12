import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionNumberSequence1734039494811
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE SEQUENCE transaction_number_seq START 100000 INCREMENT 1
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP SEQUENCE IF EXISTS transaction_number_seq;
      `);
  }
}
