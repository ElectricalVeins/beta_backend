import * as localConfig from 'config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

class ConfigurationExpert {
  private readonly localConfig: any;

  constructor() {
    this.localConfig = localConfig;
  }

  public get(propName: string, defaultValue?: any): any {
    return this.localConfig.has(propName)
      ? this.localConfig.get(propName)
      : defaultValue;
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
      migrations: this.get('db.migrationsPath'),
      migrationsRun: this.get('db.runMigrations'),
      logging: this.get('db.logging', false),
      // entities: this.get('db.cli.entitiesDir'),
    };
    return isCli ? new DataSource(opts as any) : opts;
  }
}

export const config: ConfigurationExpert = new ConfigurationExpert();
export default config.getOrmConfig(true);
