import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { AuthModule } from './auth/guards/auth.module.js';
import { HealthController } from './health.controller.js';
import { RequestIdMiddleware } from './common/http/request-id.middleware.js';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import { ProblemDetailsFilter } from './common/filters/problem-details.filter.js';
import { APP_INFO, appInfoFactory } from './app-info.js';

@Module({
  imports: [UsersModule, TicketsModule, AuthModule],
  controllers: [HealthController],
  providers: [
    { provide: APP_INFO, useFactory: appInfoFactory },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: ProblemDetailsFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*path');
  }
}