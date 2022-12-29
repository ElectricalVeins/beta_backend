import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseModel } from '../utils/BaseModel';
import { LotTag } from '../lot-tag/lot-tag.entity';
import { Bid } from '../bid/bid.entity';
import { LotPhoto } from '../lot-photo/lot-photo.entity';

@Entity()
export class Lot extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'real' })
  minimalPrice: number;

  @Column({ type: 'integer' })
  step: number;

  @Column({ type: 'timestamp' })
  deadline: Date;

  @UpdateDateColumn()
  lastModified: Date;

  @CreateDateColumn()
  createDate: Date;

  @ManyToMany(() => LotTag, { eager: true })
  @JoinTable()
  tags?: LotTag[];

  @OneToMany(() => Bid, (bid) => bid.lot, { lazy: true })
  bids?: Promise<Bid[]>;

  @OneToMany(() => LotPhoto, (photo) => photo.lot, { lazy: true })
  photos?: Promise<LotPhoto[]>;
}
