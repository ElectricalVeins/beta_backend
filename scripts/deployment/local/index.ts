/* eslint-disable no-console */
import bashCommand from '../../bashCommand';
import config from '../config';

async function getDockerCommand(): Promise<string> {
  const isOld = config.getSettings('Old docker compose', true);
  return isOld ? 'docker-compose' : 'docker compose';
}

async function run(command: string): Promise<void> {
  const dockerCommand = await getDockerCommand();
  switch (command.toLowerCase()) {
    case 'start': {
      return await bashCommand(dockerCommand, { args: ['-f', `${__dirname}/docker-compose.yaml`, 'up', '-d'] });
    }
    case 'stop': {
      return await bashCommand(dockerCommand, { args: ['-f', `${__dirname}/docker-compose.yaml`, 'stop'] });
    }
    default: {
      throw new Error('Missing script argument');
    }
  }
}

run(process.argv.slice(2)[0])
  .then(() => console.log('Successfully prepared'))
  .catch((e) => console.log('Check env dependencies in readme file', e));
