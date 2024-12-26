import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/api-error.ts';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (!(err instanceof ApiError)) {
    const statusCode =
      err?.statusCode || err instanceof mongoose.Error ? 400 : 500;
    const message = err?.message || 'Something went wrong';

    err = new ApiError({
      message,
      statusCode,
      errors: err?.errors || [],
      stack: err.stack,
    });
  }

  const response = {
    ...err,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  };

  res.status(err.statusCode).json(response);
};
