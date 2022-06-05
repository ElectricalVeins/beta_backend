import { readFileSync } from 'fs';
import { join } from 'path';

const map = {
  default: 'default',
  development: 'dev',
  production: 'default',
  test: 'test',
};
/* TODO: make deafult config to be a basis for other configs */
export default () => {
  const configKey = process.env.NODE_ENV?.toLowerCase() || 'development';
  const configFilePath = join(
    __dirname,
    '..',
    '..',
    'config',
    map[configKey],
    '.json'
  );
  const configString = readFileSync(configFilePath, 'utf8');
  const config = JSON.parse(configString);
  console.log(
    `App started with ${configKey} config:\n${Object.entries(config)
      .map((opt) => opt.join(': '))
      .join('\n')}`
  );
  return config;
};
