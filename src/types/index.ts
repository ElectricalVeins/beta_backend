import { User } from '../user/user.entity';

export type ID = string | number;

export type JwtPayload = {
  tier: string;
  userid: ID;
  role?: ID;
  status?: string; // TODO: add to jwt
};

export type UserAuth = {
  user: Partial<User>;
  session: { access: string; refresh: string; id: string };
};

export enum JwtTokenTypes {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  EMAIL = 'EMAIL',
}
