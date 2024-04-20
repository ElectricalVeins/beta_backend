import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, cts: ExecutionContext) => {
  const { user } = cts.switchToHttp().getRequest();
  if (!user) {
    throw new UnauthorizedException('Unable to get auth info');
  }
  return user;
});
