import { RolesEnum } from '../role/role.entity';
import { User } from '../user/user.entity';

export type ID = string | number;

export type JwtPayload = {
  tier: string;
  userid: ID;
  role?: RolesEnum;
};

export type UserAuth = {
  user: Partial<User>;
  tokens: { access: string; refresh: string };
};

export enum JwtTokenTypes {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  EMAIL = 'EMAIL',
}
