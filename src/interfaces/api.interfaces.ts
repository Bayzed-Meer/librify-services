interface IApiBase {
  message: string;
  statusCode: number;
  success?: boolean;
}

export interface IApiError extends IApiBase {
  errors?: any;
  stack?: string;
}

export interface IApiResponse<T> extends IApiBase {
  data: T;
}
