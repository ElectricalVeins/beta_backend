import { MigrationInterface, QueryRunner } from 'typeorm';

export class addlotphoto1672316816046 implements MigrationInterface {
  name = 'addlotphoto1672316816046';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "lot_photo"
                             (
                                 "id"         SERIAL            NOT NULL,
                                 "key"        character varying NOT NULL,
                                 "createDate" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "lotId"      integer,
                                 CONSTRAINT "PK_11c9ed1c8ceb6b781d71c007732" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "lot_photo"
        ADD CONSTRAINT "FK_cbe2eeb748ac424f06074cf67c3" FOREIGN KEY ("lotId") REFERENCES "lot" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lot_photo"
        DROP CONSTRAINT "FK_cbe2eeb748ac424f06074cf67c3"`);
    await queryRunner.query(`DROP TABLE "lot_photo"`);
  }
}
