import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../utils/BaseModel';

@Entity()
export class LotTag extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
