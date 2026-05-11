import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from './response.types';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<{ url: string }>();

    return next.handle().pipe(map((data: T) => this.formatResponse(data, request.url)));
  }

  private formatResponse(data: T, path: string): ApiResponse<T> {
    const response: ApiResponse<T> = {
      success: true,
      timestamp: new Date().toISOString(),
      path
    };

    if (this.hasMessage(data)) {
      response.message = data.message;
      const { message: _message, ...rest } = data;

      if (Object.keys(rest).length > 0) {
        response.data = rest as T;
      }

      return response;
    }

    response.data = data;
    return response;
  }

  private hasMessage(data: T): data is T & { message: string } {
    return typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string';
  }
}

