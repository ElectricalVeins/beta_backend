import { MigrationInterface, QueryRunner } from 'typeorm';

export class addtransaction1672685068983 implements MigrationInterface {
  name = 'addtransaction1672685068983';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_transactiontype_enum" AS ENUM('INCOME', 'EXPENSE', 'BLOCKED')`
    );
    await queryRunner.query(`CREATE TABLE "transaction"
                             (
                                 "id"              SERIAL                                      NOT NULL,
                                 "amount"          real                                        NOT NULL,
                                 "transactionType" "public"."transaction_transactiontype_enum" NOT NULL,
                                 "description"     character varying                           NOT NULL,
                                 "userId"          integer                                     NOT NULL,
                                 "createDate"      TIMESTAMP                                   NOT NULL DEFAULT now(),
                                 "entityName"      character varying,
                                 "entityId"        integer,
                                 CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TYPE "public"."lot_status_enum" RENAME TO "lot_status_enum_old"`);
    await queryRunner.query(
      `CREATE TYPE "public"."lot_status_enum" AS ENUM('OPEN', 'CLOSED', 'COMPLETED', 'DISABLED')`
    );
    await queryRunner.query(`ALTER TABLE "lot"
        ALTER COLUMN "status" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "lot"
        ALTER COLUMN "status" TYPE "public"."lot_status_enum" USING "status"::"text"::"public"."lot_status_enum"`);
    await queryRunner.query(`ALTER TABLE "lot"
        ALTER COLUMN "status" SET DEFAULT 'OPEN'`);
    await queryRunner.query(`DROP TYPE "public"."lot_status_enum_old"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
    await queryRunner.query(`CREATE TYPE "public"."lot_status_enum_old" AS ENUM('OPEN', 'CLOSED', 'DISABLED')`);
    await queryRunner.query(`ALTER TABLE "lot"
        ALTER COLUMN "status" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "lot"
        ALTER COLUMN "status" TYPE "public"."lot_status_enum_old" USING "status"::"text"::"public"."lot_status_enum_old"`);
    await queryRunner.query(`ALTER TABLE "lot"
        ALTER COLUMN "status" SET DEFAULT 'OPEN'`);
    await queryRunner.query(`DROP TYPE "public"."lot_status_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."lot_status_enum_old" RENAME TO "lot_status_enum"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_transactiontype_enum"`);
  }
}
