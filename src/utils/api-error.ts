import { IApiError } from '../interfaces/api.interfaces.ts';

export class ApiError extends Error implements IApiError {
  errors: any;
  message: string;
  stack?: string;
  statusCode: number;
  success: boolean;

  constructor({
    errors = [],
    message = 'Something went wrong',
    stack = '',
    statusCode,
  }: IApiError) {
    super(message);
    this.errors = errors;
    this.message = message;
    this.statusCode = statusCode;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
