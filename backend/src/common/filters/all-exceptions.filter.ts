import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<{ url: string }>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = isHttpException ? exception.getResponse() : 'Internal server error';

    response.status(status).json({
      success: false,
      statusCode: status,
      message: this.getMessage(errorResponse),
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }

  private getMessage(errorResponse: string | object): string | string[] {
    if (typeof errorResponse === 'string') {
      return errorResponse;
    }

    if ('message' in errorResponse) {
      return errorResponse.message as string | string[];
    }

    return 'Unexpected error';
  }
}

