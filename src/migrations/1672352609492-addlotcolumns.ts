import { MigrationInterface, QueryRunner } from 'typeorm';

export class addlotcolumns1672352609492 implements MigrationInterface {
  name = 'addlotcolumns1672352609492';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lot"
        ADD "userId" integer`);
    await queryRunner.query(`ALTER TABLE "lot"
        ADD CONSTRAINT "FK_d96dd0000fda7f9f94386e5b871" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`CREATE TYPE "public"."lot_status_enum" AS ENUM('OPEN', 'CLOSED')`);
    await queryRunner.query(`ALTER TABLE "lot"
        ADD "status" "public"."lot_status_enum" NOT NULL DEFAULT 'OPEN'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lot"
        DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."lot_status_enum"`);
    await queryRunner.query(`ALTER TABLE "lot"
        DROP CONSTRAINT "FK_d96dd0000fda7f9f94386e5b871"`);
    await queryRunner.query(`ALTER TABLE "lot"
        DROP COLUMN "userId"`);
  }
}
