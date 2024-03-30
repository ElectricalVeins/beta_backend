import { Module } from '@nestjs/common';
import { TierController } from './tier.controller';
import { TierService } from './tier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tier } from './tier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tier])],
  controllers: [TierController],
  providers: [TierService],
  exports: [TierService],
})
export class TierModule {}
