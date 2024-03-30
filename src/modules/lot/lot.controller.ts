import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  Post,
  Body,
  Delete,
  BadRequestException,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryParser } from '../../utils/decorator/QueryParser';
import { Lot } from './lot.entity';
import { LotService } from './lot.service';
import { CurrentUser } from '../../utils/decorator/CurrentUser';
import { JwtPayload } from '../../types';
import { RolesEnum } from '../role/role.entity';
import { Mbyte } from '../../utils/helpers';

/*nested relations: bids.user*/
const LotQueryParser = (): MethodDecorator => QueryParser(Lot);

const PhotosInterceptor = UseInterceptors(FileInterceptor('photos', { limits: { fileSize: Mbyte, files: 6 } }));

@Controller('lots')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Lot')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @Get()
  @LotQueryParser()
  findAll(@Query() opts: object): Promise<Partial<Lot[]>> {
    return this.lotService.findAll(opts);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Partial<Lot>> {
    return this.lotService.findOneById(+id);
  }

  @Post()
  @PhotosInterceptor // @UseInterceptors(fileInterceptor)
  async createLot(@Body() dto: CreateLotDto, @CurrentUser() user: JwtPayload): Promise<any> {
    return this.lotService.create(dto, user);
  }

  @Delete(':id')
  async deleteLot(@Param('id') id: number, @CurrentUser() user: JwtPayload): Promise<any> {
    // Only Admin can delete. TODO: user can delete(or disable) own lots without bids
    if (user.role !== RolesEnum.ADMIN) {
      throw new BadRequestException('Not enough rights');
    }
    return this.lotService.delete(id);
  }

  @Put(':id')
  // @PhotosInterceptor
  async updateLot(
    @Param('id') id: string,
    @Body() updateLotDto: UpdateLotDto,
    @CurrentUser() user: JwtPayload
  ): Promise<any> {
    return this.lotService.update(Number(id), updateLotDto, user);
  }
}
