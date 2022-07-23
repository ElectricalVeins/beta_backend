import { MigrationInterface, QueryRunner } from 'typeorm';

export class changerefreshtoken1658579841979 implements MigrationInterface {
  name = 'changerefreshtoken1658579841979';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_token"
        ADD "expired" integer NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_token"
        DROP COLUMN "expired"`);
  }
}
