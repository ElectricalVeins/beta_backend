import { Configuration, ConfigurationExpert } from './configuration-expert';

class CliConfiguration extends Configuration {
  public getOrmConfig(): object {
    return {
      ...super.getOrmConfig(),
      migrations: this.get('db.cli.migrationsDir'),
      entities: this.get('db.cli.entitiesDir'),
    };
  }
}

const configManager = new CliConfiguration();
export default new ConfigurationExpert(configManager).config.dataSource;
