import { MigrationInterface, QueryRunner } from 'typeorm';

export class addtokentables1657316783560 implements MigrationInterface {
  name = 'addtokentables1657316783560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "access_token"
                             (
                                 "id"         SERIAL    NOT NULL,
                                 "token"      text      NOT NULL,
                                 "createDate" TIMESTAMP NOT NULL DEFAULT now(),
                                 "userId"     integer,
                                 CONSTRAINT "PK_f20f028607b2603deabd8182d12" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "refresh_token"
                             (
                                 "id"         SERIAL    NOT NULL,
                                 "token"      text      NOT NULL,
                                 "createDate" TIMESTAMP NOT NULL DEFAULT now(),
                                 "userId"     integer,
                                 CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "access_token"
        ADD CONSTRAINT "FK_9949557d0e1b2c19e5344c171e9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "refresh_token"
        ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_token"
        DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);
    await queryRunner.query(`ALTER TABLE "access_token"
        DROP CONSTRAINT "FK_9949557d0e1b2c19e5344c171e9"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`DROP TABLE "access_token"`);
  }
}
