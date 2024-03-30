import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLotDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 128)
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4096)
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;

  tags: object[];

  photos: object[];

  @IsOptional()
  @ApiProperty({ required: false })
  deadline: string;
}
