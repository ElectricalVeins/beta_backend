/* eslint-disable no-console */
import bashCommand from '../../bashCommand';

async function run(command: string): Promise<void> {
  switch (command.toLowerCase()) {
    case 'start': {
      return await bashCommand('docker-compose', [
        '-f',
        `${__dirname}/docker-compose.yaml`,
        'up',
        '-d',
      ]);
    }
    case 'stop': {
      return await bashCommand('docker-compose', [
        '-f',
        `${__dirname}/docker-compose.yaml`,
        'stop',
      ]);
    }
    default: {
      throw new Error('Missing script argument');
    }
  }
}

run(process.argv.slice(2)[0])
  .then(() => console.log('Successfully prepared'))
  .catch(() => console.log('Check env dependencies in readme file'));
