import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBidDto } from './dto/create-bid.dto';
import { BidService } from './bid.service';
import { Bid } from './bid.entity';
import { QueryParser } from '../../utils/decorator/QueryParser';
import { CurrentUser } from '../../utils/decorator/CurrentUser';
import { JwtPayload } from '../../types';

const BidQueryParser = (): MethodDecorator => QueryParser(Bid);

@Controller('bids')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get()
  @BidQueryParser()
  findAll(@Query() opts: object): Promise<Partial<Bid[]>> {
    return this.bidService.findAll(opts);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Partial<Bid>> {
    return this.bidService.findOneById(+id);
  }

  @Post()
  async create(@Body() dto: CreateBidDto, @CurrentUser() user: JwtPayload): Promise<Partial<Bid>> {
    return this.bidService.create(dto, user);
  }
}
