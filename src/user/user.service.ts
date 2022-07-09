import { Injectable, NotFoundException } from '@nestjs/common';
import { ID } from 'src/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { RolesEnum } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private roleService: RoleService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const role = await this.roleService.getRoleByName(RolesEnum.USER);
    const draft = User.build(new User(), { ...dto, role });
    return await draft.save();
  }

  /*repo*/
  async findOneById(id: number): Promise<Partial<User>> {
    const foundUser = await User.findOne({
      where: { id },
      relations: { role: true },
    });
    if (!foundUser) {
      throw new NotFoundException();
    }
    return foundUser;
  }

  async findAll(filter?: FindManyOptions): Promise<Partial<User[]>> {
    /* return users for admin panel */
    const commonOpts: FindManyOptions = {
      relations: { role: true },
    };
    const opts: FindManyOptions = filter || {};
    return await User.find({ ...commonOpts, ...opts });
  }

  async findOneByLoginOrEmail(search: string): Promise<Partial<User>> {
    return await User.findOne({
      where: [{ login: search }, { email: search }],
      relations: { role: true },
    });
  }

  /*end repo*/

  async update(id: ID, updateUserDto: UpdateUserDto): Promise<Partial<User>> {
    const user = await this.findOneById(+id);
    user.mutate(updateUserDto);
    const upd = await user.save();
    return upd;
  }

  async checkPassword(user, checkPassword): Promise<boolean> {
    return User.checkPassword(user, checkPassword);
  }
}
