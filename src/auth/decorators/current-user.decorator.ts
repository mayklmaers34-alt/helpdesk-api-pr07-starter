import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthRequest } from '../../common/http/request-id.middleware.js';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest<AuthRequest>().user;
  },
);