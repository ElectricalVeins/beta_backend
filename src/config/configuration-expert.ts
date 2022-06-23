import * as localConfig from 'config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

class ConfigurationExpert {
  private readonly localConfig: any;

  constructor() {
    this.localConfig = localConfig;
  }

  public get(propName: string, defaultValue?: any): any {
    return this.localConfig.has(propName) ? this.localConfig.get(propName) : defaultValue;
  }

  public getOrmConfig(isCli = false): any {
    const opts: TypeOrmModuleOptions = {
      type: 'postgres',
      host: this.get('db.host'),
      port: this.get('db.port'),
      username: this.get('db.user'),
      password: this.get('db.password'),
      database: this.get('db.name'),
      autoLoadEntities: this.get('db.autoLoadEntities', true),
      logging: this.get('db.logging', false),
    };
    const cliOpts: Partial<TypeOrmModuleOptions> = {
      migrations: this.get('db.cli.migrationsDir'),
      entities: this.get('db.cli.entitiesDir'),
    };
    return isCli ? new DataSource({ ...opts, ...cliOpts } as DataSourceOptions) : opts;
  }
}

export const config: ConfigurationExpert = new ConfigurationExpert();
export default config.getOrmConfig(true);
