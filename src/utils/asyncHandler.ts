import { NextFunction, Request, RequestHandler, Response } from 'express';

export const asyncHandler =
  (requestHandler: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
