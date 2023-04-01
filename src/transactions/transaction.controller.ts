import { Controller, Get, Param, Query, Post, UseInterceptors, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { QueryParser } from '../utils/decorator/QueryParser';
import { CurrentUser } from '../utils/decorator/CurrentUser';
import { JwtPayload } from '../types';
import { OnlyOwnResourceInterceptor } from '../utils/OnlyOwnResorceInterceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const TransactionQueryParser = (): MethodDecorator => QueryParser(Transaction);
const UseOnlyOwnResourceInterceptor = (): MethodDecorator => UseInterceptors(OnlyOwnResourceInterceptor);

@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @UseOnlyOwnResourceInterceptor()
  @TransactionQueryParser()
  async getTransactions(@Query() opts: object): Promise<Transaction[]> {
    return await this.transactionService.findAll(opts);
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<Transaction> {
    return await this.transactionService.findOne(Number(id), user);
  }

  @Post()
  async topUpUserBalance(desiredAmount: number, @CurrentUser() user: JwtPayload): Promise<any> {
    return await this.transactionService.topUpUserBalance(desiredAmount, user);
  }
}
