import { IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBidDto {
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  bid: number;

  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  lot: number;
}
