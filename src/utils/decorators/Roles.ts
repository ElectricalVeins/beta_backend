import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../../modules/application/role/role.entity';

export const ROLES_KEY = 'ROLES';
export const Roles = (...roles: RolesEnum[]): CustomDecorator => {
  return SetMetadata(ROLES_KEY, roles);
};
