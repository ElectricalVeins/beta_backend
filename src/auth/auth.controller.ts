import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Public } from 'src/utils/decorator/public.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() dto: CreateUserDto): Promise<any> {
    return this.authService.signUp(dto);
  }

  @Public()
  @Post('signin')
  async signIn(@Body() dto: LoginUserDto): Promise<any> {
    return this.authService.signIn(dto);
  }

  @Public()
  @Post('refresh')
  async refresh() {
    /* refresh token pair */
    /* check refresh token */
    /* create new token pair */
    return {
      pair: {
        access: 'access',
        refresh: 'refresh',
      },
    };
  }
}
