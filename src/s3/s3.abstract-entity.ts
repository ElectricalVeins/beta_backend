import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../utils/BaseModel';

export abstract class S3Object extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @CreateDateColumn()
  createDate: Date;
}
