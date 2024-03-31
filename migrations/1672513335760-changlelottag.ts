import { MigrationInterface, QueryRunner } from 'typeorm';

export class changlelottag1672513335760 implements MigrationInterface {
  name = 'changlelottag1672513335760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lot_tag" ADD CONSTRAINT "UQ_274ac4d60b345adc633d8e7e46a" UNIQUE ("name")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lot_tag" DROP CONSTRAINT "UQ_274ac4d60b345adc633d8e7e46a"`);
  }
}
