import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Req,
  NotImplementedException,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../utils/decorator/Public';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../utils/decorator/CurrentUser';
import { JwtPayload, UserAuth } from '../types';

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

  @Public()
  @Post('signin')
  @ApiOperation({ description: 'Email could also be used as a login' })
  async signIn(@Body() dto: LoginUserDto, @Req() req: Request): Promise<UserAuth> {
    const userAgent = req.headers['user-agent'];

    return this.authService.signIn(dto, userAgent);
  }

  @Public()
  @Get('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh authentication',
    description: 'Send refresh token to get the new token couple',
  })
  async refresh(@Query('token') refreshToken: string, @Req() req: Request): Promise<UserAuth> {
    const userAgent = req.headers['user-agent'];

    return this.authService.refreshSession(refreshToken, userAgent);
  }

  @Get('activate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Account activation',
    description: 'Send token from email to activate account',
  })
  async activate(@Query('token') token: string): Promise<Partial<User>> {
    return this.authService.activateUser(token);
  }

  @Get('existing-sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get existing sessions',
    description: 'Get existing session info. Currently returns list of signed tokens for user',
  })
  async existingSessions(@CurrentUser() user: JwtPayload): Promise<object[]> {
    return this.authService.getExistingSessions(Number(user.userid));
  }

  @Delete('existing-sessions/:sessionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Sign out from existing session',
    description:
      'Sign out from existing session. This marks current token as deprecated and forbids to use it as authentication credential. You need to pass the session id, which is available in /existing-sessions endpoint',
    parameters: [{ name: 'sessionId', in: 'path' }],
  })
  async signOut(@CurrentUser() user: JwtPayload, @Param('sessionId') sessionId: string): Promise<string> {
    // TODO: AUTH | store deleted session until token expires in blacklist.
    throw new NotImplementedException();
  }
}
