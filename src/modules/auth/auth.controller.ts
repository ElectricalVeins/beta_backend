import { Body, Controller, Get, Post, Query, UseGuards, Req, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../utils/decorator/Public';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../utils/decorator/CurrentUser';
import { JwtPayload, UserAuth } from '../../types';
import { TokenPairWithSession } from '../jwt-token/jwt-token.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() dto: CreateUserDto, @Req() req: Request): Promise<UserAuth> {
    const userAgent = req.headers['user-agent'];

    return this.authService.signUp(dto, userAgent);
  }

  @ApiOperation({ description: 'Email could also be used as a login' })
  @Public()
  @Post('signin')
  async signIn(@Body() dto: LoginUserDto, @Req() req: Request): Promise<UserAuth> {
    const userAgent = req.headers['user-agent'];

    return this.authService.signIn(dto, userAgent);
  }

  @ApiOperation({
    summary: 'Refresh authentication',
    description: 'Send refresh token to get the new token couple',
  })
  @Public()
  @Get('refresh')
  async refresh(@Query('token') refreshToken: string, @Req() req: Request): Promise<UserAuth> {
    const userAgent = req.headers['user-agent'];
    // TODO: WS | emit event when new session created
    return this.authService.refreshSession(refreshToken, userAgent);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Account activation',
    description: 'Send token from email to activate account',
  })
  @Get('activate')
  @UseGuards(JwtAuthGuard)
  async activate(@Query('token') token: string): Promise<Partial<User>> {
    return this.authService.activateUser(token);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get existing sessions',
    description: 'Get existing session info. Currently returns list of signed tokens for user',
  })
  @Get('existing-sessions')
  @UseGuards(JwtAuthGuard)
  async existingSessions(@CurrentUser() user: JwtPayload): Promise<TokenPairWithSession[]> {
    return this.authService.getExistingSessions(Number(user.userid));
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Sign out from existing session',
    description:
      'Sign out from existing session. This marks current token as deprecated and forbids to use it as authentication credential. You need to pass the session id, which is available in /existing-sessions endpoint',
    parameters: [{ name: 'sessionId', in: 'path' }],
  })
  @Delete('existing-sessions/:sessionId')
  @UseGuards(JwtAuthGuard)
  async signOut(@CurrentUser() user: JwtPayload, @Param('sessionId') sessionId: string): Promise<boolean> {
    await this.authService.signOut(Number(user.userid), sessionId);
    return true;
  }
}
