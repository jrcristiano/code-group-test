import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { REQUEST_ID_HEADER } from './request-id.middleware';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId =
      (request.headers[REQUEST_ID_HEADER.toLowerCase()] as string) ||
      (request as any).requestId ||
      'unknown';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let isSafeMessage = false;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const resp = exceptionResponse as Record<string, unknown>;
        if (Array.isArray(resp.message)) {
          // ValidationPipe errors — safe to expose
          message = (resp.message as string[]).join('; ');
        } else if (typeof resp.message === 'string') {
          message = resp.message;
        }
      }

      // 4xx errors from HttpException are intentional — safe to expose
      isSafeMessage = status < 500;
    }

    if (!isSafeMessage) {
      // Log the real error securely with full context (once)
      this.logger.error({
        requestId,
        statusCode: status,
        error: exception instanceof Error ? exception.message : 'Unknown error',
        stack: exception instanceof Error ? exception.stack : undefined,
        path: request.url,
        method: request.method,
      });

      message = 'Erro interno do servidor';
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
}
