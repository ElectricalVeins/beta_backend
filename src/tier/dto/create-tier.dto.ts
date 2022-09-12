import { IsNotEmpty, IsString } from 'class-validator';
import { IsTimeZone } from '../../utils/Validator/IsTimeZone';

export class CreateTierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsTimeZone({ message: 'Invalid tier timezone' })
  timezone: string;
}
