import * as localConfig from 'config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Logger } from '@nestjs/common';

export class Configuration {
  protected readonly localConfig: any;
  protected _dataSource: DataSource;

  constructor() {
    this.localConfig = localConfig;
  }

  public set dataSource(ds: DataSource) {
    this._dataSource = ds;
  }

  public get dataSource(): DataSource {
    if (!this._dataSource) {
      throw new Error('Driver NOT connected');
    }
    return this._dataSource;
  }

  public getRedisConfig(): object {
    const ttlInMinutes = this.get('cache.ttl');
    const ttlInMs = ttlInMinutes * 60 * 1000;
    return {
      host: this.get('cache.host'),
      port: this.get('cache.port'),
      ttl: ttlInMs,
    };
  }

  public get(propName: string, defaultValue?: any): any {
    return this.localConfig.has(propName) ? this.localConfig.get(propName) : defaultValue;
  }

  public getOrmConfig(): object {
    return {
      type: 'postgres',
      host: this.get('db.host'),
      port: this.get('db.port'),
      username: this.get('db.user'),
      password: this.get('db.password'),
      database: this.get('db.name'),
      autoLoadEntities: this.get('db.autoLoadEntities', true),
      logging: this.get('db.logging', false),
    };
  }
}

export class ConfigurationExpert {
  private readonly _config: Configuration;

  constructor(configManager: Configuration) {
    this._config = configManager;
    ConfigurationExpert.initialize(configManager.getOrmConfig.bind(configManager), configManager)
      .then(() => Logger.log('Driver connected', 'ConfigurationExpert'))
      .catch((err) => Logger.error('Driver NOT connected' + err.toString(), 'ConfigurationExpert'));
  }

  private static async initialize<T extends Configuration>(configGetter: () => object, manager: T): Promise<void> {
    manager.dataSource = await new DataSource(configGetter() as DataSourceOptions).initialize();
  }

  get config(): Configuration {
    return this._config;
  }
}

const configManager = new Configuration();
export const config: Configuration = new ConfigurationExpert(configManager).config;
