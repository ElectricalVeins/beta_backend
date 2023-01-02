import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { RoleModule } from '../role/role.module';
import { TierModule } from '../tier/tier.module';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule, TierModule, BalanceModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
