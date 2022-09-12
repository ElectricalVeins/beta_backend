import { MigrationInterface, QueryRunner } from 'typeorm';

export class addtiertable1663023726061 implements MigrationInterface {
  name = 'addtiertable1663023726061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tier" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "timezone" character varying NOT NULL, CONSTRAINT "UQ_ca31b25988ac3848aef318f9b8f" UNIQUE ("name"), CONSTRAINT "PK_14d67ceef0dbea040e39e97e7f6" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tier"`);
  }
}
