import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BalanceService } from './balance.service';
import { Balance } from './balance.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../utils/decorators/CurrentUser';
import { JwtPayload } from '../../../types';

@Controller('balance')
@UseGuards(JwtAuthGuard)
@ApiTags('Balance')
@ApiBearerAuth()
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  async getCurrentUserBalance(@CurrentUser() user: JwtPayload): Promise<Balance> {
    return await this.balanceService.getUserBalance(user);
  }

  @Get('paymentintegration/increase')
  @ApiOperation({
    summary: 'should not be here',
    description: 'Top up account balance - temporal solution. Should integrate "stripe" here',
  })
  async increaseUserBalance(@CurrentUser() user: JwtPayload, @Query('amount') amount: number): Promise<Balance> {
    return await this.balanceService.topUpUserBalance(user, amount);
  }
}
