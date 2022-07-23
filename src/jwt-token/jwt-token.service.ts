import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { config } from '../config/configuration-expert';
import { JwtPayload, JwtTokenTypes } from '../types';
import { createKey, getSecondsFromConfig } from '../utils/helpers';

export const JwtOptions: Record<JwtTokenTypes, JwtSignOptions> = {
  [JwtTokenTypes.ACCESS]: {
    expiresIn: config.get('app.jwt.timeAccess'),
    secret: config.get('app.jwt.secretAccess'),
  },
  [JwtTokenTypes.REFRESH]: {
    expiresIn: config.get('app.jwt.timeRefresh'),
    secret: config.get('app.jwt.secretRefresh'),
  },
  [JwtTokenTypes.EMAIL]: {
    expiresIn: config.get('app.jwt.timeAccess'),
    secret: config.get('app.jwt.secretAccess'),
  },
};

type AccessTokenString = string;
type RefreshTokenString = string;
type AccessTokenCacheSetter = () => unknown;

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async verifyConfirmEmailToken(token): Promise<any> {
    return this.verifyToken(token, JwtTokenTypes.EMAIL);
  }

  public async verifyToken(token: string, type: JwtTokenTypes): Promise<any> {
    return this.jwtService.verifyAsync(token, JwtOptions[type]);
  }

  public async createConfirmEmailToken(user): Promise<string> {
    return this.jwtService.signAsync({ id: user.id }, JwtOptions.REFRESH);
  }

  public getTokenPayload(token: string): { iat; exp } {
    const { payload } = this.jwtService.decode(token, { complete: true }) as any;
    return payload;
  }

  public async signTokens(
    payload: JwtPayload
  ): Promise<[[AccessTokenString, RefreshTokenString], AccessTokenCacheSetter]> {
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(payload, JwtOptions[JwtTokenTypes.ACCESS]),
      this.jwtService.signAsync(payload, JwtOptions[JwtTokenTypes.REFRESH]),
    ]);
    const { iat } = this.getTokenPayload(access);
    const setCache = this.cacheManager.set.bind(this, createKey(payload.userid, iat), access, {
      ttl: getSecondsFromConfig(JwtOptions.ACCESS.expiresIn as string),
    });
    return [[access, refresh], setCache];
  }
}
