import { MigrationInterface, QueryRunner } from 'typeorm';

export class deleterefreshtoken1681043552526 implements MigrationInterface {
  name = 'deleterefreshtoken1681043552526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "refresh_token"`);
  }

  down(queryRunner: QueryRunner): Promise<any> {
    return Promise.resolve(undefined);
  }
}
