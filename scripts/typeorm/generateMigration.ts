/* eslint-disable no-console */
import bashCommand from '../bashCommand';

async function run(command: string): Promise<void> {
  if (typeof command !== 'string' || command === '') {
    throw new Error('Enter the migration name');
  }
  return await bashCommand(
    `npx typeorm-ts-node-esm migration:generate ./src/migrations/${command.toLowerCase()} -d ./src/config/configuration-expert.ts`
  );
}

run(process.argv.slice(2)[0]).catch((err) => console.log(err));
