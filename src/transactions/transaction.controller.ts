import { Controller, Get, Param, Query, Post } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { QueryParser } from 'src/utils/decorator/QueryParser';
import { CurrentUser } from 'src/utils/decorator/CurrentUser';
import { JwtPayload } from 'src/types';

const TransactionQueryParser = (): MethodDecorator => QueryParser(Transaction);

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  /* TODO: validation: get only own resource */
  @TransactionQueryParser()
  async getTransactions(@Query() opts: object, @CurrentUser() user: JwtPayload): Promise<Transaction[]> {
    /* Add userid to query */
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
