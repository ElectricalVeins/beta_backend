import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Tier } from './tier.entity';
import { CreateTierDto } from './dto/create-tier.dto';
import { TierService } from './tier.service';
import { RolesEnum } from '../role/role.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../../utils/decorators/Roles';

@Controller('tiers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Tiers')
export class TierController {
  constructor(private readonly tierService: TierService) {}

  @Post()
  @Roles(RolesEnum.MASTER)
  create(@Body() dto: CreateTierDto): Promise<Tier> {
    return this.tierService.create(dto);
  }

  @Post()
  @Roles(RolesEnum.USER)
  publicFind(): Promise<Tier[]> {
    return this.tierService.publicFind();
  }
}
