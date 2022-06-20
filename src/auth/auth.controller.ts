import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/utils/decorator/public.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  async signUp(@Body() dto: CreateUserDto) {
    /* validate user */
    /* check user email and login on uniqueness (via hooks or simply catch the error) */
    /* hash password */
    /* create user */
    /* return user without password */
    /* create token pair */
    /* return user and token pair */
    return this.authService.signUp(dto);
  }

  @Public()
  @Post()
  async signIn() {
    /* login user and send token pair */
    return {
      pair: {
        access: 'access',
        refresh: 'refresh',
      },
      user: {},
    };
  }

  @Public()
  @Post()
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
