import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh authentication',
    description: 'Send refresh token to get the new token couple',
  })
  async refresh(@Query('auth') refreshToken: string): Promise<any> {
    return this.authService.refreshSession(refreshToken);
  }

  @Get('activate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Account activation',
    description: 'Send token from email to activate account',
  })
  async activate(@Query('token') token: string): Promise<any> {
    return this.authService.activateUser(token);
  }
}
