import { Entity, ManyToOne } from 'typeorm';
import { S3Object } from '../s3/s3.abstract-entity';
import { Lot } from '../lot/lot.entity';

@Entity()
export class LotPhoto extends S3Object {
  @ManyToOne(() => Lot, (lot) => lot.photos, { lazy: true })
  lot: Promise<Lot>;
}
