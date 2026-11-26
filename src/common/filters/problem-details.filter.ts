import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import type { AuthRequest } from '../http/request-id.middleware.js';

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<AuthRequest>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let detail = 'Сталася непередбачена помилка. Повідомте ідентифікатор запиту адміністратору.';
    let title = 'Внутрішня помилка сервера';
    let allowed: string[] | undefined;
    let errors: unknown[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      title = res.error || 'Помилка';
      
      if (Array.isArray(res.message)) {
        detail = res.message.join('; ');
      } else if (typeof res.message === 'string') {
        detail = res.message;
      } else {
        detail = res.error || detail;
      }
      allowed = res.allowed;
      errors = res.errors;

      if (status === HttpStatus.UNAUTHORIZED) {
        response.setHeader('WWW-Authenticate', 'Bearer realm="helpdesk"');
      }
      if (status >= 400 && status < 500) {
        this.logger.warn(`${request.method} ${request.originalUrl} - ${status}: ${detail}`);
      }
    } else {
      this.logger.error(`Unhandled Exception [${request.requestId}]`, (exception as Error).stack);
    }

    response
      .status(status)
      .type('application/problem+json')
      .json({
        type: 'about:blank',
        title,
        status,
        detail,
        instance: request.originalUrl,
        requestId: request.requestId,
        ...(allowed && { allowed }),
        ...(errors && { errors }),
      });
  }
}