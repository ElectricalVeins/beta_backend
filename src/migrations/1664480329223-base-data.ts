import { MigrationInterface, QueryRunner } from 'typeorm';
import { RolesEnum } from '../role/role.entity';

export class baseData1664480329223 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "role" ("name")
       values ('${RolesEnum.MASTER}'),
              ('${RolesEnum.ADMIN}'),
              ('${RolesEnum.PREMIUM}'),
              ('${RolesEnum.USER}');`
    );
    await queryRunner.query(
      `INSERT INTO "tier" ("name","timezone","level") values ('Default','UTC','PUBLIC'), ('Internal','UTC','INTERNAL');`
    );
  }

  public async down(): Promise<void> {
    return;
  }
}
