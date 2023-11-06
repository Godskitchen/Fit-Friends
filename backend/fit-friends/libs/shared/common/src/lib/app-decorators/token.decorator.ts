import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Token = createParamDecorator(
  (_key: string, ctx: ExecutionContext) => {
    const { headers } = ctx.switchToHttp().getRequest();

    const [, token] = headers['authorization'].split(' ');
    return token;
  },
);
