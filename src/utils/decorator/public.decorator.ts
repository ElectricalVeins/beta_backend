import { CustomDecorator, SetMetadata } from '@nestjs/common';
/* enables public endpoint */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
