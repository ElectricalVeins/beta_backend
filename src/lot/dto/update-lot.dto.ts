import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateLotDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 128)
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4096)
  @IsOptional()
  description: string;

  tags: object[];

  photos: object[];

  @IsOptional()
  deadline: string;
}
