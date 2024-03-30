import { IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBidDto {
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  bid: number;

  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  lot: number;
}
