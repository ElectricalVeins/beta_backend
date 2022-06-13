import { Injectable } from '@nestjs/common';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  getAllRoles() {
    return Role.find();
  }
}
