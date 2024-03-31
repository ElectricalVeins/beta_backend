import { addMinutes, isAfter } from 'date-fns';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import config from '../../../config/configuration-expert';
import { getSecondsFromConfig, timeAccess } from '../../../utils/helpers';
import { JwtPayload } from '../../../types';
import { TokenService } from '../../jwt-token/jwt-token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly time: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly tokenService: TokenService
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('app.jwt.secretAccess'),
    });
    this.time = getSecondsFromConfig(timeAccess);
  }

  async validate(req: Request, payload: JwtPayload): Promise<object> {
    const [, token] = req.headers['authorization']?.split(' ');
    if (token) {
      const sessions = await this.tokenService.getBannedSessions(Number(payload.userid), token);
      if (sessions.length) {
        throw new UnauthorizedException('Deprecated session');
      }
    }
    /*Disable long-living tokens*/
    const maxPossibleDate = addMinutes(Date.now(), this.time);
    const tokenDate = new Date(Number(`${payload['exp']}000`)); // amount of seconds to ms
    if (isAfter(tokenDate, maxPossibleDate)) {
      throw new UnauthorizedException('Invalid token');
    }
    return payload;
  }
}
