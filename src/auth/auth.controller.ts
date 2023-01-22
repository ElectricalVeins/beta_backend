import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Public } from '../utils/decorator/Public';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  async refresh(@Query('auth') refreshToken: string): Promise<any> {
    return this.authService.refreshSession(refreshToken);
  }

  @Get('activate')
  @UseGuards(JwtAuthGuard)
  async activate(@Query('token') token: string): Promise<any> {
    return this.authService.activateUser(token);
  }
}
