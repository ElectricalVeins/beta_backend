import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, FindManyOptions } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { Bid, BidStatusEnum } from './bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { JwtPayload } from '../../types';
import { LotService } from '../lot/lot.service';
import { Lot } from '../lot/lot.entity';
import { BalanceService } from '../balance/balance.service';

type PossibleNumber = number | string;

@Injectable()
export class BidService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => LotService)) private readonly lotService: LotService,
    private readonly balanceService: BalanceService
  ) {}

  checkNextBid(actualBid: PossibleNumber, step: PossibleNumber, nextBid: PossibleNumber): boolean {
    return Number(actualBid) + Number(step) > Number(nextBid);
  }

  async create(dto: CreateBidDto, user: JwtPayload): Promise<any> {
    return await this.dataSource.transaction('REPEATABLE READ', async (transaction) => {
      /*TODO: Check is User active and Balance is Ok status*/
      const lot: Lot = await this.lotService.getOpenLotById(dto.lot, transaction);
      if (user.userid === lot.userId) {
        throw new BadRequestException('You can`t bid your own lot');
      }
      const actualLotBid: Bid = await this.getActualBid(lot.id, transaction);
      const isFirstBid = !Boolean(actualLotBid);
      const actualBidAmount = isFirstBid ? 0 : actualLotBid.bid;
      if (!isFirstBid && actualLotBid.userId === user.userid) {
        throw new BadRequestException('You can`t outbid your own bid');
      }
      if (this.checkNextBid(actualBidAmount || lot.minimalPrice, actualBidAmount ? lot.step : 0, dto.bid)) {
        throw new BadRequestException('Your bid is too small for this lot');
      }
      const allUserActualBids = await this.getActualUserBids(Number(user.userid), transaction);
      const bidDiff = dto.bid - actualBidAmount;
      //We can pass a bid diff here to level out current actual lot bid
      const isUserCanAffordNewBid = await this.balanceService.checkUserBalance(
        Number(user.userid),
        allUserActualBids,
        bidDiff,
        transaction
      );
      if (!isUserCanAffordNewBid) {
        throw new BadRequestException('You dont have enough money to make this bid');
      }
      return await this.setNewActualBid(dto, lot, actualLotBid, Number(user.userid), transaction);
    });
    /* TODO: Emit ws event about new bid to lot owner and other participants */
  }

  async setNewActualBid(
    bid: CreateBidDto,
    lot: Lot,
    oldBidEntity: Bid | null,
    userId: number,
    transaction: EntityManager
  ): Promise<Bid> {
    if (oldBidEntity) {
      await transaction
        .createQueryBuilder()
        .update(Bid)
        .set({ status: BidStatusEnum.OUTBID })
        .where('lot = :lotId', { lotId: lot.id })
        .execute();
      await this.balanceService.declineTransactionAfterOutbid(
        {
          lotId: lot.id,
          amount: oldBidEntity.bid,
          oldPayerId: oldBidEntity.userId,
        },
        transaction
      );
    }
    const newActualBid = await transaction.save(Bid.build(new Bid(), { ...bid, user: { id: userId } }));
    await this.balanceService.blockAmountForBid(
      {
        bidId: newActualBid.id,
        payerId: Number(newActualBid.userId),
        lotId: lot.id,
        amount: newActualBid.bid,
      },
      transaction
    );
    return newActualBid;
  }

  async getActualBid(lotId: number, transaction: EntityManager): Promise<Bid> {
    return await transaction.getRepository(Bid).findOne({
      where: { lot: { id: lotId }, status: BidStatusEnum.ACTUAL },
      relations: {},
      order: { createDate: 'DESC' },
    });
  }

  async getActualUserBids(userId: number, transaction: EntityManager): Promise<Bid[]> {
    return await transaction.getRepository(Bid).find({
      where: { user: { id: userId }, status: BidStatusEnum.ACTUAL },
      relations: {},
    });
  }

  async setWinBid(bid: Bid, transaction: EntityManager): Promise<void> {
    await transaction.getRepository(Bid).update(bid.id, { status: BidStatusEnum.WIN });
  }

  /*repo*/
  async findAll(filter?: FindManyOptions): Promise<Partial<Bid[]>> {
    return await Bid.find(filter);
  }

  async findOneById(id: number, relations: FindOptionsRelations<Bid> = {}): Promise<Partial<Bid>> {
    return await Bid.findOneOrFail({ where: { id }, relations });
  }

  /*end repo*/
}
