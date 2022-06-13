import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role, RolesEnum } from '../role/role.entity';
import { BaseModel } from '../utils/BaseModel';

export const enum UserStatusEnum {
  BLOCKED = 'BLOCKED',
  ONLINE = 'ONLINE', // ??? extract to separate boolean field
  ACTIVE = 'ACTIVE', // after email activation
  INACTIVE = 'INACTIVE', // before email confirmation
}

@Entity()
export class User extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  login: string;

  @Column()
  password: string;

  @Index({ unique: true })
  @Column({
    unique: true,
  })
  email: string;

  @Column({
    default: UserStatusEnum.INACTIVE,
  })
  status: UserStatusEnum;

  @ManyToOne(() => Role, (role) => role.users)
  role: RolesEnum;

  @UpdateDateColumn()
  lastModified: Date;

  @CreateDateColumn()
  createDate: Date;
}
