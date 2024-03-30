import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { TierLevel } from '../../tier/tier.entity';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  login: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: TierLevel, default: TierLevel.PUBLIC })
  tier: string;

  @IsString()
  @ApiProperty({ required: false })
  preferredTimezone?: string;
}
