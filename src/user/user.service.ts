import { Injectable } from '@nestjs/common';
import { ID } from 'src/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { RolesEnum } from '../role/role.entity';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
  constructor(private roleService: RoleService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const role = await this.roleService.getRoleByName(RolesEnum.USER);
    const draft = User.build(new User(), { ...dto, role });
    return await draft.save();
  }

  findAll() {
    /* return users for admin panel */
    return [];
  }

  async checkPassword(user, checkPassword): Promise<boolean> {
    return User.checkPassword(user, checkPassword);
  }

  /*repo*/
  findOneById(id: number) {
    return User.findOneBy({ id });
  }

  async findOneByLoginOrEmail(search: string): Promise<User> {
    return await User.findOne({
      where: [{ login: search }, { email: search }],
      relations: ['role'],
    });
  }
  /*end repo*/
  update(id: ID, updateUserDto: UpdateUserDto) {
    /* check rights */
    /* check token */
    /* check updateable fields for user */
    /* update and return */
    return `This action updates a #${id} user`;
  }
}
