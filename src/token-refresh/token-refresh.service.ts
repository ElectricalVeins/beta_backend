import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshToken } from './token-refresh.entity';
import { config } from '../config/configuration-expert';

@Injectable()
export class RefreshTokenService {
  protected tokensMaxAllowedAmount: number;

  constructor() {
    this.tokensMaxAllowedAmount = config.get('app.jwt.maxAmount');
  }

  async createRecord(token: string, userId: number, isCheckAmount = true): Promise<object> {
    if (isCheckAmount) {
      await this.checkExistingRefreshTokensAmount(userId);
    }
    return RefreshToken.save({
      token,
      user: { id: userId },
    });
  }

  async getRefreshToken(token, userId): Promise<RefreshToken> {
    const tokenRecord = await RefreshToken.findOne({
      where: { user: { id: userId }, token },
    });
    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid token');
    }
    return tokenRecord;
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
