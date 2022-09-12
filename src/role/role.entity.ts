import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../utils/BaseModel';
import { User } from '../user/user.entity';

export enum RolesEnum {
  MASTER = 'MASTER',
  ADMIN = 'ADMIN',
  PREMIUM = 'PREMIUM',
  USER = 'USER',
}

@Entity()
export class Role extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: RolesEnum;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
