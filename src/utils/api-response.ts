import { IApiResponse } from '../interfaces/api.interfaces.ts';

export class ApiResponse<T> implements IApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  success: boolean;

  constructor({ data, message, statusCode }: IApiResponse<T>) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.success = statusCode < 400;
  }
}
