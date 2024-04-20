import { Controller, Get, Param, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { QueryParser } from '../../../utils/decorators/QueryParser';
import { OnlyOwnResourceInterceptor } from '../../../utils/OnlyOwnResorceInterceptor';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../utils/decorators/CurrentUser';
import { JwtPayload } from '../../../types';

const TransactionQueryParser = (): MethodDecorator => QueryParser(Transaction);
const UseOnlyOwnResourceInterceptor = (): MethodDecorator => UseInterceptors(OnlyOwnResourceInterceptor);

@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

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
}
