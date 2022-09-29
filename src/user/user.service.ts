import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { ID } from '../types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatusEnum } from './user.entity';
import { RolesEnum } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { TierService } from '../tier/tier.service';

@Injectable()
export class UserService {
  constructor(private roleService: RoleService, private tierService: TierService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const role = await this.roleService.getRoleByName(RolesEnum.USER);
    /* start region: Validation */
    const tier = await this.tierService.findOne(dto.tier);
    if (!tier) {
      throw new NotFoundException('Specified User.tier not found!');
    }
    /* end region */
    const draft = User.build(new User(), { ...dto, role, tier });
    return await draft.save();
  }

  /*repo*/
  async findOneById(id: number, tier: number): Promise<Partial<User>> {
    const foundUser = await User.findOne({
      where: {
        id,
        tier: { id: tier },
      },
      relations: { role: true },
    });
    if (!foundUser) {
      throw new NotFoundException();
    }
    return foundUser;
  }

  async findAll(filter?: FindManyOptions): Promise<Partial<User[]>> {
    return await User.find(filter);
  }

  async findOneByLoginOrEmail(search: string): Promise<Partial<User>> {
    return await User.findOne({
      where: [{ login: search }, { email: search }],
      relations: { role: true },
    });
  }

  /*end repo*/

  async update(id: number, updateUserDto: UpdateUserDto, tierId: string): Promise<Partial<User>> {
    const user = await this.findOneById(id, Number(tierId));
    user.mutate(updateUserDto);
    return user.save();
  }

  async updateUserStatus(id: ID, status: UserStatusEnum, tierId: string): Promise<Partial<User>> {
    const user = await this.findOneById(Number(id), Number(tierId));
    user.mutate({ status });
    return user.save();
  }

  async activateUser(id: ID, tier: string): Promise<Partial<User>> {
    return this.updateUserStatus(id, UserStatusEnum.ACTIVE, tier);
  }

  async blockUser(id: ID, tier: string): Promise<Partial<User>> {
    return this.updateUserStatus(id, UserStatusEnum.BLOCKED, tier);
  }

  async checkPassword(user, checkPassword): Promise<boolean> {
    return User.checkPassword(user, checkPassword);
  }
}
