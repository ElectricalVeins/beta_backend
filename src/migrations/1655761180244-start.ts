import { MigrationInterface, QueryRunner } from 'typeorm';
import { RolesEnum } from '../role/role.entity';

export class start1655761180244 implements MigrationInterface {
  name = 'start1655761180244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role"
             (
                 "id"   SERIAL            NOT NULL,
                 "name" character varying NOT NULL,
                 CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"),
                 CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
             )`
    );
    await queryRunner.query(
      `CREATE TABLE "user"
             (
                 "id"           SERIAL            NOT NULL,
                 "login"        character varying NOT NULL,
                 "password"     character varying NOT NULL,
                 "email"        character varying NOT NULL,
                 "status"       character varying NOT NULL DEFAULT 'INACTIVE',
                 "lastModified" TIMESTAMP         NOT NULL DEFAULT now(),
                 "createDate"   TIMESTAMP         NOT NULL DEFAULT now(),
                 "roleId"       integer,
                 CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                 CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
             )`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a62473490b3e4578fd683235c5" ON "user" ("login") `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
    await queryRunner.query(
      `ALTER TABLE "user"
                ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `INSERT INTO "role" ("name")
       values ('${RolesEnum.ADMIN}'),
              ('${RolesEnum.PREMIUM}'),
              ('${RolesEnum.USER}');`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user"
                DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a62473490b3e4578fd683235c5"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
