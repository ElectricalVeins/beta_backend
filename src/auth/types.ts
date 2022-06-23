import { ID } from '../types';
import { RolesEnum } from '../role/role.entity';
import { User } from '../user/user.entity';

export type JwtPayload = {
  userid: ID;
  role?: RolesEnum;
};

export enum JwtTokenTypes {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

export type UserAuth = {
  user: Partial<User>;
  tokens: { access: string; refresh: string };
};
