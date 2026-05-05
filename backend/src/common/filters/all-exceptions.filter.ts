import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<{ url: string }>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : this.getStatus(exception);
    const errorResponse = isHttpException
      ? exception.getResponse()
      : this.getUnhandledMessage(exception);

    if (!isHttpException && process.env.NODE_ENV !== 'production') {
      this.logger.error(exception);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: this.getMessage(errorResponse),
      timestamp: new Date().toISOString(),
      path: request.url,
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

  private getStatus(exception: unknown): HttpStatus {
    if (this.isMongoDuplicateError(exception)) {
      return HttpStatus.CONFLICT;
    }

    if (this.isMongooseValidationError(exception)) {
      return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getUnhandledMessage(exception: unknown): string {
    if (this.isMongoDuplicateError(exception)) {
      return 'Account already exists with the same phone, email, or Google account.';
    }

    if (this.isMongooseValidationError(exception)) {
      return exception.message;
    }

    if (exception instanceof Error && exception.name === 'MongoServerError') {
      return exception.message;
    }

    return 'Internal server error';
  }

  private isMongoDuplicateError(
    exception: unknown,
  ): exception is { code: number } {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      exception.code === 11000
    );
  }

  private isMongooseValidationError(exception: unknown): exception is Error {
    return exception instanceof Error && exception.name === 'ValidationError';
  }
}
