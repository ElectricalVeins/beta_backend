import { Injectable } from '@nestjs/common';

import { CreateTierDto } from './dto/create-tier.dto';
import { Tier, TierLevel } from './tier.entity';

@Injectable()
export class TierService {
  async create(dto: CreateTierDto): Promise<Tier> {
    return await Tier.build(new Tier(), dto).save();
  }

  async findOne(criteria: number | string): Promise<Tier> {
    return Tier.findOneBy({
      [typeof criteria === 'string' ? 'name' : 'id']: criteria,
    });
  }

  async publicFind(): Promise<Tier[]> {
    return Tier.find({ where: { level: TierLevel.PUBLIC } });
  }
}
