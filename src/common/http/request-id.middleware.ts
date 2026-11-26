import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export interface AuthRequest extends Request {
  requestId: string;
  user?: any;
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: AuthRequest, res: Response, next: NextFunction) {
    const headerId = req.headers['x-request-id'] as string;
    const isValid = headerId && /^[\w-]{8,64}$/.test(headerId);
    const requestId = isValid ? headerId : randomUUID();

    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
  }
}