// import ms from 'ms';

import { config } from '../config/configuration-expert';

export const timeAccess = config.get('app.jwt.timeAccess');

export const deleteLastCharInString = (s: string): string => s.slice(0, -1);
export const deleteFirstCharInString = (s: string): string => s.slice(1);

export const createKey = (...parts: (string | number)[]): string => parts.join(':');
// export const getSecondsFromConfig = (configTimeSpan: string): number => ms(configTimeSpan) / 1000;
export const getSecondsFromConfig = (configTimeSpan: string): number => {
  const minutes = Number(deleteLastCharInString(configTimeSpan));
  if (Number.isNaN(minutes)) {
    throw new Error('Invalid config: app.jwt.timeAccess');
  }
  return minutes * 60;
};
