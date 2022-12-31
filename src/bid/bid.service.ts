import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, FindManyOptions } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { Bid, BidStatusEnum } from './bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { JwtPayload } from '../types';
import { LotService } from '../lot/lot.service';
import { config } from '../config/configuration-expert';
import { Lot } from '../lot/lot.entity';

type PossibleNumber = number | string;

@Injectable()
export class BidService {
  constructor(private readonly lotService: LotService) {}

  checkNextBid(actualBid: PossibleNumber, step: PossibleNumber, nextBid: PossibleNumber): boolean {
    return Number(actualBid) + Number(step) > Number(nextBid);
  }

  async create(dto: CreateBidDto, user: JwtPayload): Promise<any> {
    return await config.dataSource.transaction('REPEATABLE READ', async (transactionalEntityManager) => {
      const lot: Lot = await this.lotService.getOpenLotById(dto.lot, transactionalEntityManager);
      if (user.userid === lot.user.id) {
        throw new BadRequestException('Action is permitted');
      }
      const actualBid: Bid = await this.getActualBid(lot.id, transactionalEntityManager);
      if (this.checkNextBid(actualBid?.bid || lot.minimalPrice, lot.step, dto.bid)) {
        throw new BadRequestException('Your bid is too small for this lot');
      }
      const newBid = await this.setNewActualBid(dto, lot, transactionalEntityManager);
      return newBid;
    });
    /* TODO: Emit ws event about new bid to lot owner and other participants */
  }

  async setNewActualBid(bid: CreateBidDto, lot: Lot, transactionalEntityManager: EntityManager): Promise<Bid> {
    await transactionalEntityManager
      .createQueryBuilder()
      .update(Bid)
      .set({ status: BidStatusEnum.BEAT })
      .where('lot = :lotId', { lotId: lot.id })
      .execute();
    return await transactionalEntityManager.save(Bid.build(new Bid(), bid));
  }

  async getActualBid(lotId: number, transactionalEntityManager: EntityManager): Promise<Bid> {
    return await transactionalEntityManager.getRepository(Bid).findOne({
      where: { id: lotId },
      relations: {},
      order: { createDate: 'DESC' },
    });
  }

  /*repo*/
  async findAll(filter?: FindManyOptions): Promise<Partial<Bid[]>> {
    return await Bid.find(filter);
  }

  async findOneById(id: number, relations: FindOptionsRelations<Bid> = {}): Promise<Partial<Bid>> {
    const entity = await Bid.findOne({
      where: { id },
      relations,
    });
    if (!entity) {
      throw new NotFoundException();
    }
    return entity;
  }

  /*end repo*/
}
