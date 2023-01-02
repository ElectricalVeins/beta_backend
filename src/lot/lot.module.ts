import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from '../s3/s3.module';
import { LotTagModule } from '../lot-tag/lot-tag.module';
import { LotPhotoModule } from '../lot-photo/lot-photo.module';
import { LotService } from './lot.service';
import { Lot } from './lot.entity';
import { LotController } from './lot.controller';
import { BidModule } from '../bid/bid.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lot]), S3Module, LotPhotoModule, LotTagModule, BidModule, UserModule],
  controllers: [LotController],
  providers: [LotService],
  exports: [LotService],
})
export class LotModule {}
