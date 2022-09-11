/* eslint-disable no-console */
import { readFileSync } from 'fs';
import { resolve } from 'path';

class Config {
  private readonly json: object;

  constructor() {
    this.json = Config.loadJson();
  }

  public getSettings(fieldName: string, defaultValue: any): any {
    const value = this.json[fieldName];
    if (value === undefined) {
      console.log(`Not found key: "${fieldName}". Using default value: ${defaultValue}`);
      return defaultValue;
    }
    return value;
  }

  private static loadJson(): object {
    return JSON.parse(
      readFileSync(resolve('.', 'scripts', 'deployment', 'config', 'deployment.json'), { encoding: 'utf-8' })
    );
  }
}

export default new Config();
