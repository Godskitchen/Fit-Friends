import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookie = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return key && key in request.cookies
      ? request.cookies[key]
      : key
      ? null
      : request.cookies;
  },
);
