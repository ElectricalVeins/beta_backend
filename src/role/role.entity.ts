import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../utils/BaseModel';
import { User } from '../user/user.entity';

export enum RolesEnum {
  USER = 'USER',
  PREMIUM = 'PREMIUM',
  ADMIN = 'ADMIN',
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
