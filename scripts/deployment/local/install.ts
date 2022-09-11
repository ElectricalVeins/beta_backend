/* eslint-disable no-console */
import bashCommand from '../../bashCommand';

bashCommand('yarn run env:local:start')
  .then(() => bashCommand('yarn run typeorm:run'))
  .catch((err) => console.error(err));
