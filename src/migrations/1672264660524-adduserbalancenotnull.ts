import { MigrationInterface, QueryRunner } from 'typeorm';

export class adduserbalancenotnull1672264660524 implements MigrationInterface {
  name = 'adduserbalancenotnull1672264660524';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
        DROP CONSTRAINT "FK_122eba7abb932493831f1e0f62b"`);
    await queryRunner.query(`ALTER TABLE "user"
        ALTER COLUMN "balanceId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD CONSTRAINT "FK_122eba7abb932493831f1e0f62b" FOREIGN KEY ("balanceId") REFERENCES "balance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
        DROP CONSTRAINT "FK_122eba7abb932493831f1e0f62b"`);
    await queryRunner.query(`ALTER TABLE "user"
        ALTER COLUMN "balanceId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD CONSTRAINT "FK_122eba7abb932493831f1e0f62b" FOREIGN KEY ("balanceId") REFERENCES "balance" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
