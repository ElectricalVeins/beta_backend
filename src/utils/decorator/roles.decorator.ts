import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from 'src/role/role.entity';

export const ROLES_KEY = 'ROLES';
export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
