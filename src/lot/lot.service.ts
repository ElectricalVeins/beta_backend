import { v4 as uuid } from 'uuid';
import { BadRequestException, Injectable, Logger, NotFoundException, NotImplementedException } from '@nestjs/common';
import { EntityManager, FindManyOptions } from 'typeorm';
import { Lot, LotStatusEnum } from './lot.entity';
import { S3ObjectTypesEnum, S3Service } from '../s3/s3.service';
import { LotPhotoService } from '../lot-photo/lot-photo.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { JwtPayload } from '../types';
import { UpdateLotDto } from './dto/update-lot.dto';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

@Injectable()
export class LotService {
  constructor(private readonly s3Service: S3Service, private readonly lotPhotoService: LotPhotoService) {}

  async create(dto: CreateLotDto, user: JwtPayload): Promise<Lot> {
    const { photos, ...restOfDto } = dto;
    const draft = Lot.build(new Lot(), { ...restOfDto, user: user.userid });
    const lotEntity = await draft.save();
    if (photos) {
      const photoKeys = await Promise.all(
        photos.map(async (photo) => {
          const [key] = await this.s3Service.uploadObjectToBucket(S3ObjectTypesEnum.AUCTION_PHOTO, photo, uuid());
          return key;
        })
      );
      lotEntity.photos = await this.lotPhotoService.bulkCreateByKeys(photoKeys, lotEntity.user.id);
      await lotEntity.save();
    }
    return lotEntity;
  }

  async delete(id: number): Promise<any> {
    const entity = await Lot.findOne({
      where: { id },
      relations: ['photos'],
    });
    if (!entity) {
      throw new NotFoundException('Lot not found');
    }
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

  async update(id: number, dto: UpdateLotDto, user: JwtPayload): Promise<any> {
    const lot = await this.findOneById(id, { user: true });
    if (lot.user.id !== user.userid) {
      throw new BadRequestException('You dont have rights!');
    }
    if (lot.photos.length) {
      throw new NotImplementedException('TBD'); // TODO: deliver feature
    }
    lot.mutate(dto);
    return await lot.save();
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
      relations: { user: true },
    });
    if (!entity) {
      throw new NotFoundException('Lot not found or has been closed');
    }
    return entity;
  }

  /*end repo*/
}
