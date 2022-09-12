import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../utils/BaseModel';
import { User } from '../user/user.entity';

@Entity()
export class Tier extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  timezone: string;

  @OneToMany(() => User, (user) => user.tier, { lazy: true })
  user: Promise<User>;
}
