import { readFileSync } from 'fs';
import { join } from 'path';

const CONFIG_PATH = join(__dirname, '..', '..', 'config');

const map = {
  default: 'default',
  development: 'dev.json',
  production: 'default.json',
  test: 'test.json',
};
/* TODO: make deafult config to be a basis for other configs */
export default () => {
  const configKey = process.env.NODE_ENV?.toLowerCase() || 'development';
  console.log(configKey);
  const configFilePath = join(CONFIG_PATH, map[configKey]);
  const configString = readFileSync(configFilePath, 'utf8');
  const config = JSON.parse(configString);
  console.log(`App started with ${configKey} config:\n${configString}`);
  return config;
};
