import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../utils/BaseModel';
import { User } from '../user/user.entity';

@Entity()
export class AccessToken extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'text' })
  token: string;

  @ManyToOne(() => User, (user) => user.accessTokens, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createDate: Date;
}
