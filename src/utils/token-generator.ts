import mongoose from 'mongoose';
import { IUser } from '../interfaces/user.interfaces.ts';
import { User } from '../models/user.models.ts';
import { ApiError } from './api-error.ts';
import jwt from 'jsonwebtoken';
import * as process from 'node:process';

export const generateAccessAndRefreshTokens = async (
  userId: mongoose.Types.ObjectId,
): Promise<{ accessToken: string; refreshToken: string } | null> => {
  try {
    const user: IUser | null = await User.findById(userId).select('+role');
    if (!user) {
      return null;
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log('Error while generating tokens: ', error);
    throw new ApiError({
      statusCode: 500,
      message: 'Something went wrong while generating refresh and access token',
    });
  }
};

export const generateResetPasswordToken = async (
  email: string,
): Promise<string | null> => {
  try {
    return jwt.sign({ email }, process.env.RESET_PASSWORD_SECRET as string, {
      expiresIn: process.env.RESET_PASSWORD_EXPIRY,
    });
  } catch (error) {
    console.log('Error while generating reset password token: ', error);
    throw new ApiError({
      statusCode: 500,
      message: 'Something went wrong while generating reset password token',
    });
  }
};
