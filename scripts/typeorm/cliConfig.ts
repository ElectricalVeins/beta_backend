import * as localConfig from 'config';
import { DataSource, DataSourceOptions } from 'typeorm';

function getOrmConfig(): DataSourceOptions {
  return {
    type: 'postgres',
    host: localConfig.get('db.host'),
    port: localConfig.get('db.port'),
    username: localConfig.get('db.user'),
    password: localConfig.get('db.password'),
    database: localConfig.get('db.name'),
    logging: localConfig.get('db.logging'),
    migrations: localConfig.get('db.cli.migrationsDir'),
    entities: localConfig.get('db.cli.entitiesDir'),
  };
}

export default new DataSource(getOrmConfig());
