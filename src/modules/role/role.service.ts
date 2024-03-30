import { Injectable } from '@nestjs/common';
import { Role, RolesEnum } from './role.entity';

@Injectable()
export class RoleService {
  getAllRoles(): Promise<Role[]> {
    return Role.find();
  }

  getRoleByName(name: RolesEnum): Promise<Role> {
    return Role.findOne({ where: { name } });
  }
}
