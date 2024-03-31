import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { v4 as uuid } from 'uuid';
import { differenceInMilliseconds } from 'date-fns';
import config from '../../config/configuration-expert';
import { JwtPayload, JwtTokenTypes } from '../../types';
import { createCacheKey, getSecondsFromConfig } from '../../utils/helpers';

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

  public createSessionKey(...keyParts: string[]): string {
    return `SESSIONS:${createCacheKey(...keyParts)}`;
  }

  public createBannedSessionKey(...keyParts: string[]): string {
    return `BANNED_SESSIONS:${createCacheKey(...keyParts)}`;
  }

  public async signTokens(payload: JwtPayload, userAgent: string): Promise<TokenPairWithSession> {
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(payload, JwtOptions[JwtTokenTypes.ACCESS]),
      this.jwtService.signAsync(payload, JwtOptions[JwtTokenTypes.REFRESH]),
    ]);

    return await this.saveSession(access, refresh, payload, userAgent);
  }

  public async getExistingSessions(userId: number): Promise<TokenPairWithSession[]> {
    const pattern = this.createSessionKey(String(userId), '*');

    return this.bulkGetSessions(pattern);
  }

  public async getBannedSessions(userId: number, sessionId?: string): Promise<TokenPairWithSession[]> {
    const pattern = this.createBannedSessionKey(String(userId), sessionId || '*');

    return this.bulkGetSessions(pattern);
  }

  public async banSession(userId: number, sessionId: string): Promise<void> {
    const session = await this.cacheManager.get<TokenPairWithSession>(this.createSessionKey(String(userId), sessionId));
    if (!session) {
      throw new BadRequestException('Unable to find specified session');
    }
    const { exp } = this.decodeTokenPayload(session.refresh);
    const ttl = differenceInMilliseconds(new Date(Number(`${exp}000`)), new Date());

    await this.cacheManager.set(this.createBannedSessionKey(String(userId), session.access), session.id, ttl);
    await this.cacheManager.del(this.createSessionKey(String(userId), session.id));

    return;
  }

  private async saveSession(
    access: AccessTokenString,
    refresh: RefreshTokenString,
    payload: JwtPayload,
    userAgent: string
  ): Promise<TokenPairWithSession> {
    const id = uuid();
    const createdAt = new Date().toISOString();
    const ttl = Number(`${getSecondsFromConfig(String(JwtOptions.ACCESS.expiresIn))}000`); // TODO: REFACTOR
    await this.cacheManager.set(
      this.createSessionKey(String(payload.userid), id),
      { access, refresh, userAgent, createdAt, id },
      ttl
    );

    return { access, refresh, userAgent, createdAt, id };
  }

  private async bulkGetSessions(keyPattern: string): Promise<TokenPairWithSession[]> {
    const keys = await this.cacheManager.store.keys(keyPattern);

    return await Promise.all(keys.map(async (key) => this.cacheManager.get(key)));
  }
}
