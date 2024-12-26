import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.ts';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { ApiError } from '../utils/api-error.ts';
import { JwtPayload } from '../interfaces/jwt.interfaces.ts';
import { IUser } from '../interfaces/user.interfaces.ts';

export const verifyToken = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token: string =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError({ statusCode: 401, message: 'Unauthorized request' });
    }

    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      ) as JwtPayload;
    } catch (error) {
      throw new ApiError({
        statusCode: 401,
        message: 'Unauthorized request',
        errors: error,
      });
    }

    const user: IUser = await User.findById(decodedToken?._id).select(
      '-password -refreshToken',
    );

    if (!user) {
      throw new ApiError({ statusCode: 401, message: 'User not found' });
    }

    req.user = user;
    next();
  },
);

export const verifyRole =
  (allowedRoles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req?.user?.role) {
      throw new ApiError({ statusCode: 401, message: 'Unauthorized request' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError({
        statusCode: 403,
        message: 'Forbidden: insufficient privileges',
      });
    }

    next();
  };

export const verifyResetPasswordToken = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const { resetPasswordToken } = req.cookies;

    if (!resetPasswordToken) {
      throw new ApiError({
        statusCode: 400,
        message: 'Reset password token is required',
      });
    }

    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(
        resetPasswordToken as string,
        process.env.RESET_PASSWORD_SECRET as string,
      ) as JwtPayload;
    } catch (error) {
      throw new ApiError({
        statusCode: 401,
        message: 'Unauthorized request',
        errors: error,
      });
    }

    const user: IUser | null = await User.findOne({
      email: decodedToken?.email,
    });

    if (!user) {
      throw new ApiError({ statusCode: 401, message: 'User not found' });
    }

    req.user = user;
    next();
  },
);
