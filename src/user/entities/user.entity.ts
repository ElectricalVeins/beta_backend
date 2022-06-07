import { BaseModel } from 'src/utils/BaseModel';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const enum UserStatusEnum {
  BLOCKED = 'BLOCKED',
  ONLINE = 'ONLINE',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity()
export class User extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    default: UserStatusEnum.INACTIVE,
  })
  status: UserStatusEnum;
}
