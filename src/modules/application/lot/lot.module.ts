import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotTagModule } from '../lot-tag/lot-tag.module';
import { LotPhotoModule } from '../lot-photo/lot-photo.module';
import { LotService } from './lot.service';
import { Lot } from './lot.entity';
import { LotController } from './lot.controller';
import { BidModule } from '../bid/bid.module';
import { UserModule } from '../user/user.module';
import { S3Module } from '../../external/s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot]),
    forwardRef(() => BidModule),
    S3Module,
    LotPhotoModule,
    LotTagModule,
    UserModule,
  ],
  controllers: [LotController],
  providers: [LotService],
  exports: [LotService],
})
export class LotModule {}
