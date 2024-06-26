import { IsNotEmpty, IsString, IsTimeZone } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTierDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsTimeZone({ message: 'Invalid tier timezone' })
  @ApiProperty()
  timezone: string;
}
