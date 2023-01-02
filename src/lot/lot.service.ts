import { v4 as uuid } from 'uuid';
import { differenceInMilliseconds } from 'date-fns';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { DataSource, EntityManager, FindManyOptions } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { S3ObjectTypesEnum, S3Service } from '../s3/s3.service';
import { LotPhotoService } from '../lot-photo/lot-photo.service';
import { LotTagService } from '../lot-tag/lot-tag.service';
import { BidService } from '../bid/bid.service';
import { UserService } from '../user/user.service';
import { JwtPayload } from '../types';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { Lot, LotStatusEnum } from './lot.entity';
import { RolesEnum } from '../role/role.entity';
import { BidStatusEnum } from '../bid/bid.entity';

export type LotTimerPayload = {
  id: number;
  milliseconds: number;
};

@Injectable()
export class LotService implements OnApplicationBootstrap {
  constructor(
    private readonly dataSource: DataSource,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly s3Service: S3Service,
    private readonly lotPhotoService: LotPhotoService,
    private readonly lotTagService: LotTagService,
    @Inject(forwardRef(() => BidService)) private readonly bidService: BidService,
    private readonly userService: UserService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.startLotTimers();
  }

  private static getTimerPayloadFromLot(lot: Lot): LotTimerPayload {
    return {
      id: lot.id,
      milliseconds: differenceInMilliseconds(new Date(), new Date(lot.deadline)),
    };
  }

  async create(dto: CreateLotDto, user: JwtPayload): Promise<Lot> {
    /*TODO: Check is User active*/
    const { photos = [], tags = [], ...restOfDto } = dto;
    const draft = Lot.build(new Lot(), {
      ...restOfDto,
      tags: await this.lotTagService.bulkCreateOrFindTags(tags),
      user: { id: user.userid },
    });
    const lotEntity = await draft.save();
    if (photos.length) {
      const photoKeys = await Promise.all(
        photos.map(async (photo) => {
          const [key] = await this.s3Service.uploadObjectToBucket(S3ObjectTypesEnum.AUCTION_PHOTO, photo, uuid());
          return key;
        })
      );
      lotEntity.photos = await this.lotPhotoService.bulkCreateByKeys(photoKeys, lotEntity.userId);
      await lotEntity.save();
    }
    this.startLotTimer(LotService.getTimerPayloadFromLot(lotEntity));
    return lotEntity;
  }

  async delete(id: number): Promise<any> {
    const entity = await Lot.findOneOrFail({ where: { id }, relations: ['photos'] });
    if (entity.photos.length) {
      Promise.all(
        entity.photos.map(async (photo) =>
          this.s3Service.deleteObjectFromBucket(S3ObjectTypesEnum.AUCTION_PHOTO, photo.key)
        )
      ).catch((e) => {
        Logger.warn('Cant delete object from AWS S3');
        Logger.error(e);
      });
    }
    return entity.remove();
  }

  async update(id: number, dto: UpdateLotDto, user: JwtPayload): Promise<Lot> {
    const lot = await this.findOneById(id);
    if (lot.userId !== user.userid || user.role !== RolesEnum.ADMIN) {
      throw new BadRequestException('You dont have rights');
    }
    if (lot.photos.length) {
      throw new NotImplementedException('TBD'); // TODO: deliver feature
    }
    if (dto.deadline) {
      throw new NotImplementedException('TBD'); // TODO: add deadline update (timers should update)
    }
    lot.mutate(dto);
    return await lot.save();
  }

  async closeLot(lotId: number): Promise<void> {
    await this.dataSource.transaction('REPEATABLE READ', async (transaction) => {
      const lot: Lot = await this.getOpenLotWithActualBid(lotId, transaction);
      const {
        bids: [bid],
        userId: receiver,
      } = lot;
      const { userId: payer, bid: moneyAmount, id: bidId } = bid;
      if (bid) {
        await this.bidService.setWinBid(bid, transaction);
      }
      await this.userService.accrueMoneyForLot(
        {
          bidId,
          payerId: payer,
          receiverId: receiver,
          amount: moneyAmount,
          lotId: lotId,
        },
        transaction
      );
      await transaction.getRepository(Lot).update(lotId, { status: LotStatusEnum.CLOSED });
      /* TODO: Emit ws event about lot status update to lot owner and other participants */
    });
  }

  private async startLotTimers(): Promise<void> {
    const lots = await this.getAllActualLots();
    const timerPayloads: LotTimerPayload[] = lots.map(LotService.getTimerPayloadFromLot);
    timerPayloads.forEach(this.startLotTimer);
    Logger.log(`${timerPayloads.length} timers were created`);
  }

  startLotTimer(payload: LotTimerPayload): any {
    const timeout = setTimeout(this.closeLot, payload.milliseconds, payload.id);
    this.schedulerRegistry.addTimeout(`Lot.Close:${payload.id}`, timeout);
  }

  /*repo*/
  async findAll(filter?: FindManyOptions): Promise<Partial<Lot[]>> {
    return await Lot.find(filter);
  }

  async findOneById(id: number, relations: FindOptionsRelations<Lot> = {}): Promise<Partial<Lot>> {
    return await Lot.findOneOrFail({ where: { id }, relations });
  }

  async getOpenLotById(id: number, transaction: EntityManager): Promise<Lot> {
    const entity = await transaction.getRepository(Lot).findOne({
      where: { id, status: LotStatusEnum.OPEN },
      relations: {},
    });
    if (!entity) {
      throw new NotFoundException('Lot not found or has been closed');
    }
    return entity;
  }

  async getOpenLotWithActualBid(id: number, transaction: EntityManager): Promise<Lot> {
    return await transaction.getRepository(Lot).findOne({
      where: {
        id,
        status: LotStatusEnum.OPEN,
        bids: {
          status: BidStatusEnum.ACTUAL,
        },
      },
      relations: { bids: true },
    });
  }

  async getAllActualLots(): Promise<Lot[]> {
    return await Lot.find({
      relations: {},
      where: { status: LotStatusEnum.OPEN },
    });
  }

  /*end repo*/
}
