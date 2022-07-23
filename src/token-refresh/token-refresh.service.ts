import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DeleteResult, LessThan } from 'typeorm';
import { RefreshToken } from './token-refresh.entity';
import { TokenService } from '../jwt-token/jwt-token.service';
import { config } from '../config/configuration-expert';

@Injectable()
export class RefreshTokenService {
  protected tokensMaxAllowedAmount: number;

  constructor(private tokenService: TokenService) {
    this.tokensMaxAllowedAmount = config.get('app.jwt.maxAmount');
  }

  async createRecord(token: string, userId: number, isCheckAmount = true): Promise<object> {
    if (isCheckAmount) {
      await this.checkExistingRefreshTokensAmount(userId);
    }
    const { exp } = this.tokenService.getTokenPayload(token);
    return RefreshToken.save({
      token,
      expired: exp,
      user: { id: userId },
    });
  }

  async getTokenRecordByValue(token: string, userId: number): Promise<RefreshToken> {
    const tokenRecord = await RefreshToken.findOne({
      where: { user: { id: userId }, token },
    });
    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid token');
    }
    return tokenRecord;
  }

  async deleteExpiredTokens(): Promise<DeleteResult> {
    const currentSecond = Number.parseInt(String(Date.now() / 1000));
    return RefreshToken.delete({ expired: LessThan(currentSecond) });
  }

  async checkExistingRefreshTokensAmount(userId: number): Promise<void> {
    const tokens = await RefreshToken.find({
      where: { user: { id: userId } },
      order: { createDate: 'ASC' },
    });
    if (tokens.length >= this.tokensMaxAllowedAmount) {
      const [oldestToken] = tokens;
      await this.deleteRecord(oldestToken);
    }
  }

  async deleteRecord(entity: RefreshToken): Promise<Partial<RefreshToken>> {
    return entity.remove();
  }
}
