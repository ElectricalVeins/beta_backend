import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../utils/decorator/CurrentUser';
import { JwtPayload } from '../types';
import { BalanceService } from './balance.service';
import { Balance } from './balance.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('balance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  async getCurrentUserBalance(@CurrentUser() user: JwtPayload): Promise<Balance> {
    return await this.balanceService.getUserBalance(user);
  }

  @Get('paymentintegration/increase')
  async increaseUserBalance(@CurrentUser() user: JwtPayload, @Query('amount') amount: number): Promise<Balance> {
    return await this.balanceService.addToUserBalance(user, amount);
  }
}
