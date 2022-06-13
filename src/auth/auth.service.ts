import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  public validateUserOnSignUp(data: any): any {
    return true;
  }
  public async(payload) {
    return {
      access: this.jwtService.sign(payload),
    };
  }
}
