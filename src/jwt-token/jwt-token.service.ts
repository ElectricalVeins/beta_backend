import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { v4 as uuid } from 'uuid';
import config from '../config/configuration-expert';
import { JwtPayload, JwtTokenTypes } from '../types';
import { createCacheKey, getSecondsFromConfig } from '../utils/helpers';

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
export type TokenPairWithSession = {
  id: string;
  access: AccessTokenString;
  refresh: RefreshTokenString;
  userAgent: string;
  createdAt: string;
};

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

  public decodeTokenPayload(token: string): { iat: string; exp: number } {
    const decoded = this.jwtService.decode(token, { complete: true });
    if (typeof decoded === 'object' && decoded !== null) {
      return decoded.payload;
    }
    throw new Error('Invalid token payload');
  }

  public createTokenKey(...keyParts: string[]): string {
    return `SESSIONS:${createCacheKey(...keyParts)}`;
  }

  private async saveTokens(
    access: AccessTokenString,
    refresh: RefreshTokenString,
    payload: JwtPayload,
    userAgent: string
  ): Promise<TokenPairWithSession> {
    const id = uuid();
    const createdAt = new Date().toISOString();
    const t = await this.cacheManager.set<TokenPairWithSession>(
      this.createTokenKey(String(payload.userid), id),
      { access, refresh, userAgent, createdAt, id },
      { ttl: getSecondsFromConfig(JwtOptions.ACCESS.expiresIn as string) }
    );

    return { access, refresh, userAgent, createdAt, id };
  }

  public async signTokens(payload: JwtPayload, userAgent: string): Promise<TokenPairWithSession> {
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(payload, JwtOptions[JwtTokenTypes.ACCESS]),
      this.jwtService.signAsync(payload, JwtOptions[JwtTokenTypes.REFRESH]),
    ]);

    return await this.saveTokens(access, refresh, payload, userAgent);
  }
}
