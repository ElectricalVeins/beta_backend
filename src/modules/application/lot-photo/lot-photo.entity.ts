import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lot } from '../lot/lot.entity';

@Entity()
export class LotPhoto extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  key: string;

  @CreateDateColumn()
  createDate: Date;

  @ManyToOne(() => Lot, (lot) => lot.photos)
  lot: Lot;
}
