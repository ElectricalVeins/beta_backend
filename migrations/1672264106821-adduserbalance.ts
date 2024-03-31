import { MigrationInterface, QueryRunner } from 'typeorm';

export class adduserbalance1672264106821 implements MigrationInterface {
  name = 'adduserbalance1672264106821';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."balance_status_enum" AS ENUM('OK', 'BLOCKED', 'UNAPPROVED')`);
    await queryRunner.query(`CREATE TABLE "balance"
                             (
                                 "id"           SERIAL                         NOT NULL,
                                 "amount"       real                           NOT NULL DEFAULT '0',
                                 "status"       "public"."balance_status_enum" NOT NULL DEFAULT 'UNAPPROVED',
                                 "lastModified" TIMESTAMP                      NOT NULL DEFAULT now(),
                                 CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD "balanceId" integer`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD CONSTRAINT "UQ_122eba7abb932493831f1e0f62b" UNIQUE ("balanceId")`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD CONSTRAINT "FK_122eba7abb932493831f1e0f62b" FOREIGN KEY ("balanceId") REFERENCES "balance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
        DROP CONSTRAINT "FK_122eba7abb932493831f1e0f62b"`);
    await queryRunner.query(`ALTER TABLE "user"
        DROP CONSTRAINT "UQ_122eba7abb932493831f1e0f62b"`);
    await queryRunner.query(`ALTER TABLE "user"
        DROP COLUMN "balanceId"`);
    await queryRunner.query(`DROP TABLE "balance"`);
    await queryRunner.query(`DROP TYPE "public"."balance_status_enum"`);
  }
}
