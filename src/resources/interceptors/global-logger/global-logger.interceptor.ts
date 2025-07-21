import {
  CallHandler,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { RequestUser } from 'src/modules/auth/auth.guard';

@Injectable()
export class GlobalLoggerInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request: Request | RequestUser = httpContext.getRequest<
      Request | RequestUser
    >();
    const response: Response = httpContext.getResponse<Response>();

    const { path, method } = request;
    const { statusCode } = response;
    this.logger.log(`${method} ${path}`);

    const preControllerInstant = Date.now();

    return next.handle().pipe(
      tap(() => {
        if ('user' in request) {
          this.logger.log(`Route visited by uid ${request.user.id}`);
        }

        const routeTimeExecution = Date.now() - preControllerInstant;
        this.logger.log(
          `Response: status ${statusCode} - execution time ${routeTimeExecution}ms`,
        );
      }),
    );
  }
}
