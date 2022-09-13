import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1663109237300 implements MigrationInterface {
  name = 'initial1663109237300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" SERIAL NOT NULL, "token" text NOT NULL, "expired" integer NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."tier_level_enum" AS ENUM('INTERNAL', 'PUBLIC')`);
    await queryRunner.query(
      `CREATE TABLE "tier" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "timezone" character varying NOT NULL, "level" "public"."tier_level_enum" NOT NULL, CONSTRAINT "UQ_ca31b25988ac3848aef318f9b8f" UNIQUE ("name"), CONSTRAINT "PK_14d67ceef0dbea040e39e97e7f6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum" AS ENUM('BLOCKED', 'ONLINE', 'ACTIVE', 'INACTIVE')`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "login" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "status" "public"."user_status_enum" NOT NULL DEFAULT 'INACTIVE', "preferredTimezone" character varying, "lastModified" TIMESTAMP NOT NULL DEFAULT now(), "createDate" TIMESTAMP NOT NULL DEFAULT now(), "roleId" integer NOT NULL, "tierId" integer NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a62473490b3e4578fd683235c5" ON "user" ("login") `);
    await queryRunner.query(`CREATE TYPE "public"."role_name_enum" AS ENUM('MASTER', 'ADMIN', 'PREMIUM', 'USER')`);
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" "public"."role_name_enum" NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_8dcf78ac4a83d7e2d36abecb8f3" FOREIGN KEY ("tierId") REFERENCES "tier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_8dcf78ac4a83d7e2d36abecb8f3"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TYPE "public"."role_name_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a62473490b3e4578fd683235c5"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    await queryRunner.query(`DROP TABLE "tier"`);
    await queryRunner.query(`DROP TYPE "public"."tier_level_enum"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
  }
}
