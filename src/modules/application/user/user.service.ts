import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, FindManyOptions } from 'typeorm';
import { TierService } from '../tier/tier.service';
import { AccruePayload, BalanceService } from '../balance/balance.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatusEnum } from './user.entity';
import { Transaction } from '../transactions/transaction.entity';
import { RoleService } from '../role/role.service';
import { RolesEnum } from '../role/role.entity';
import { ID } from 'aws-sdk/clients/s3';

@Injectable()
export class UserService {
  constructor(
    // TODO: insert dataSource instead of Services
    private roleService: RoleService,
    private tierService: TierService,
    private readonly balanceService: BalanceService
  ) {}

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
    return await User.findOneOrFail({
      where: { id, tier: { id: tier } },
      relations: { role: true },
    });
  }

  async findAll(filter?: FindManyOptions): Promise<Partial<User[]>> {
    return await User.find(filter);
  }

  async findOneByLoginOrEmail(search: string): Promise<Partial<User>> {
    return await User.findOne({
      where: [{ login: search }, { email: search }],
      relations: { role: true, tier: true },
    });
  }

  /*end repo*/

  async update(id: number, dto: UpdateUserDto, tierId: string): Promise<Partial<User>> {
    const user = await this.findOneById(id, Number(tierId));
    user.mutate(dto);
    return await user.save();
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
    // TODO: implement password verification
    return true;
  }

  async accrueMoneyForLot(payload: AccruePayload, transaction: EntityManager): Promise<Transaction> {
    return await this.balanceService.accrueMoneyForLot(payload, transaction);
  }
}
