import { MigrationInterface, QueryRunner } from 'typeorm';

export class addauctionbaseentities1672269909785 implements MigrationInterface {
  name = 'addauctionbaseentities1672269909785';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "lot_tag"
                             (
                                 "id"   SERIAL            NOT NULL,
                                 "name" character varying NOT NULL,
                                 CONSTRAINT "PK_31e2c2afc515f7cdc69ea0959a0" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "lot"
                             (
                                 "id"           SERIAL            NOT NULL,
                                 "name"         character varying NOT NULL,
                                 "description"  text              NOT NULL,
                                 "price"        real              NOT NULL,
                                 "minimalPrice" real              NOT NULL,
                                 "step"         integer           NOT NULL,
                                 "deadline"     TIMESTAMP         NOT NULL,
                                 "lastModified" TIMESTAMP         NOT NULL DEFAULT now(),
                                 "createDate"   TIMESTAMP         NOT NULL DEFAULT now(),
                                 CONSTRAINT "PK_2ba293e2165c7b93cd766c8ac9b" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TYPE "public"."bid_status_enum" AS ENUM('ACTUAL', 'BEAT', 'WIN')`);
    await queryRunner.query(`CREATE TABLE "bid"
                             (
                                 "id"         SERIAL                     NOT NULL,
                                 "bid"        real                       NOT NULL,
                                 "status"     "public"."bid_status_enum" NOT NULL DEFAULT 'ACTUAL',
                                 "createDate" TIMESTAMP                  NOT NULL DEFAULT now(),
                                 "lotId"      integer                    NOT NULL,
                                 "userId"     integer                    NOT NULL,
                                 CONSTRAINT "PK_ed405dda320051aca2dcb1a50bb" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "lot_tags_lot_tag"
                             (
                                 "lotId"    integer NOT NULL,
                                 "lotTagId" integer NOT NULL,
                                 CONSTRAINT "PK_f3afbd70350f466c5c67ea08ba5" PRIMARY KEY ("lotId", "lotTagId")
                             )`);
    await queryRunner.query(`CREATE INDEX "IDX_f1431ab419eb5e6e5e4635869a" ON "lot_tags_lot_tag" ("lotId") `);
    await queryRunner.query(`CREATE INDEX "IDX_47c71363b6a1c03dcf3590d2aa" ON "lot_tags_lot_tag" ("lotTagId") `);
    await queryRunner.query(`ALTER TABLE "bid"
        ADD CONSTRAINT "FK_03de8f257efea9dc91146efd786" FOREIGN KEY ("lotId") REFERENCES "lot" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "bid"
        ADD CONSTRAINT "FK_b0f254bd6d29d3da2b6a8af262b" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "lot_tags_lot_tag"
        ADD CONSTRAINT "FK_f1431ab419eb5e6e5e4635869a2" FOREIGN KEY ("lotId") REFERENCES "lot" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "lot_tags_lot_tag"
        ADD CONSTRAINT "FK_47c71363b6a1c03dcf3590d2aa2" FOREIGN KEY ("lotTagId") REFERENCES "lot_tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lot_tags_lot_tag"
        DROP CONSTRAINT "FK_47c71363b6a1c03dcf3590d2aa2"`);
    await queryRunner.query(`ALTER TABLE "lot_tags_lot_tag"
        DROP CONSTRAINT "FK_f1431ab419eb5e6e5e4635869a2"`);
    await queryRunner.query(`ALTER TABLE "bid"
        DROP CONSTRAINT "FK_b0f254bd6d29d3da2b6a8af262b"`);
    await queryRunner.query(`ALTER TABLE "bid"
        DROP CONSTRAINT "FK_03de8f257efea9dc91146efd786"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_47c71363b6a1c03dcf3590d2aa"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f1431ab419eb5e6e5e4635869a"`);
    await queryRunner.query(`DROP TABLE "lot_tags_lot_tag"`);
    await queryRunner.query(`DROP TABLE "bid"`);
    await queryRunner.query(`DROP TYPE "public"."bid_status_enum"`);
    await queryRunner.query(`DROP TABLE "lot"`);
    await queryRunner.query(`DROP TABLE "lot_tag"`);
  }

}
