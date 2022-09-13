import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../utils/BaseModel';
import { User } from '../user/user.entity';

export enum TierLevel {
  INTERNAL = 'INTERNAL',
  PUBLIC = 'PUBLIC',
}

@Entity()
export class Tier extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  timezone: string;

  @Column({ type: 'enum', enum: TierLevel })
  level: TierLevel;

  @OneToMany(() => User, (user) => user.tier, { lazy: true })
  user: Promise<User>;
}
