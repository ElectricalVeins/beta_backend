import { Controller, Post, UseGuards } from '@nestjs/common';
import { Public } from 'src/utils/decorator/public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  async login() {
    /* login user and send token pair */
    return {
      pair: {
        access: 'access',
        refresh: 'refresh',
      },
      user: {},
    };
  }

  /* refresh token pair */
}
