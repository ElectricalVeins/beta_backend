import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { config } from '../config/configuration-expert';
import { JwtPayload, JwtTokenTypes, UserAuth } from './types';
import { RefreshTokenService } from '../token-refresh/token-refresh.service';

/* TODO: SEPARATE SECRETS FOR TOKENS */

const JwtOptions: Record<JwtTokenTypes, JwtSignOptions> = {
  [JwtTokenTypes.ACCESS]: {
    expiresIn: config.get('app.jwt.timeAccess'),
  },
  [JwtTokenTypes.REFRESH]: {
    expiresIn: config.get('app.jwt.timeRefresh'),
  },
};

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private refreshTokenService: RefreshTokenService
  ) {}

  public validateUserOnSignUp(data: object): boolean {
    console.log('validate on signup spare func');
    return true;
  }

  public async signUp(dto: CreateUserDto): Promise<UserAuth> {
    const user = await this.userService.create(dto);
    const [access, refresh] = await this.signTokens({ userid: user.id, role: user.role['id'] });
    await this.refreshTokenService.createRecord(refresh, user.id, false);
    return {
      user,
      tokens: { access, refresh },
    };
  }

  public async signIn(dto): Promise<UserAuth> {
    const user = await this.userService.findOneByLoginOrEmail(dto.login);
    if (!user) {
      throw new UnauthorizedException('Incorrect login or password');
    }

    const isCorrectPassword = await this.userService.checkPassword(user, dto.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Incorrect login or password');
    }
    const [access, refresh] = await this.signTokens({ userid: user.id, role: user.role['id'] });
    await this.refreshTokenService.createRecord(refresh, user.id);
    return {
      user,
      tokens: { access, refresh },
    };
  }

  public async refreshSession(authHeader: string): Promise<UserAuth> {
    const [type, refreshToken] = authHeader.split(' ');
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Wrong token type');
    }
    // TODO: if not verified token is expired - delete record. Use redis to store tokens? Write a sql func?
    const { id } = await this.jwtService.verifyAsync(refreshToken);
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException();
    }
    const [access, refresh] = await this.signTokens({ userid: user.id, role: user.role['id'] });

    const [existingRefreshToken] = await Promise.all([
      this.refreshTokenService.getTokenRecordByValue(refreshToken, user.id),
    ]);
    await config.dataSource.transaction(async () => {
      return Promise.all([
        this.refreshTokenService.deleteRecord(existingRefreshToken),
        this.refreshTokenService.createRecord(refresh, user.id),
      ]);
    });
    return {
      user,
      tokens: { access, refresh },
    };
  }

  private async signTokens(payload: JwtPayload): Promise<[string, string]> {
    /* TODO: Implement the whitelist of tokens. To increase the auth secureness */
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(payload, JwtOptions[JwtTokenTypes.ACCESS]),
      this.jwtService.signAsync(payload, JwtOptions[JwtTokenTypes.REFRESH]),
    ]);
    return [access, refresh];
  }
}
