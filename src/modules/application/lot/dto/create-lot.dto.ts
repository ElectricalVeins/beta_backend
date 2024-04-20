import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLotDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 128)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4096)
  @ApiProperty()
  description: string;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @ApiProperty()
  price: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty()
  minimalPrice: number;

  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  step: number;

  @IsDateString()
  @ApiProperty()
  deadline: Date;

  @IsOptional()
  @ApiProperty({ required: false })
  tags: string[];

  @IsOptional()
  @ApiProperty({ required: false })
  photos: unknown[];
}
