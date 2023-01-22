import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../utils/decorator/CurrentUser';
import { JwtPayload } from '../types';
import { BalanceService } from './balance.service';
import { Balance } from './balance.entity';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  async getCurrentUserBalance(@CurrentUser() user: JwtPayload): Promise<Balance> {
    return await this.balanceService.getUserBalance(user);
  }
}
