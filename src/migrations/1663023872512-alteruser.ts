import { MigrationInterface, QueryRunner } from 'typeorm';

export class alteruser1663023872512 implements MigrationInterface {
  name = 'alteruser1663023872512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "preferredTimezone" character varying`);
    await queryRunner.query(`ALTER TABLE "user" ADD "tierId" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_8dcf78ac4a83d7e2d36abecb8f3" FOREIGN KEY ("tierId") REFERENCES "tier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_8dcf78ac4a83d7e2d36abecb8f3"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tierId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "preferredTimezone"`);
  }
}
