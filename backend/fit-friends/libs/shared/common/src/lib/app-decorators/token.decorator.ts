import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const Token = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const { headers } = ctx.switchToHttp().getRequest<Request>();
    if (headers['authorization']) {
      const [, token] = headers['authorization'].split(' ');
      return token;
    }
    return null;
  },
);
