import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
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
  @Get('refresh')
  async refresh(@Headers('Authorization') authHeader: string): Promise<any> {
    return this.authService.refreshSession(authHeader);
  }
}
