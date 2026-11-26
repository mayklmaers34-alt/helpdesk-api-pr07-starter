import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { AuthRequest } from '../http/request-id.middleware.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<AuthRequest>();
    const response = ctx.getResponse();
    
    const { method, originalUrl, requestId } = request;
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const start = performance.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Math.round(performance.now() - start);
        response.setHeader('Server-Timing', `app;dur=${duration}`);
        const statusCode = response.statusCode;
        this.logger.log(`${method} ${originalUrl} -> ${statusCode} ${duration}ms [${className}.${handlerName}] [${requestId}]`);
      }),
    );
  }
}