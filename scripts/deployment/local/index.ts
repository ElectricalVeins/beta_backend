/* eslint-disable no-console */
import bashCommand from '../../bashCommand';

async function getDockerCommand(): Promise<string> {
  try {
    const command = 'docker compose';
    await bashCommand(command, { io: null });
    return command;
  } catch (e) {
    const command = 'docker-compose';
    await bashCommand(command, { io: null });
    return command;
  }
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
