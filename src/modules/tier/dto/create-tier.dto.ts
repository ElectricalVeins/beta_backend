import { IsNotEmpty, IsString } from 'class-validator';
import { IsTimeZone } from '../../../utils/Validator/IsTimeZone';
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
