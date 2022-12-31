import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLotDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 128)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4096)
  description: string;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  minimalPrice: number;

  @IsInt()
  @Type(() => Number)
  step: number;

  @IsDateString()
  deadline: Date;

  tags: object[];

  photos: object[];
}
