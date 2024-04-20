import * as localConfig from 'config';

export class Configuration {
  protected readonly localConfig: any;

  constructor() {
    this.localConfig = localConfig;
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
      retryAttempts: 5, 
      retryDelay: 5000,
    };
  }
}

export default new Configuration();
