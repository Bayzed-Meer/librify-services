import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { User } from '../models/user.models.ts';
import { IUser } from '../interfaces/user.interfaces.ts';
import { ApiError } from '../utils/api-error.ts';
import { isValidEmail } from '../utils/validators.ts';
import { ApiResponse } from '../utils/api-response.ts';

export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { fullName, email, phoneNumber, gender } = req.body;
    const userId = req.user._id;

    if (!isValidEmail(email)) {
      throw new ApiError({
        statusCode: 400,
        message: 'Invalid email address! Please provide a valid email address',
      });
    }

    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      userId,
      { fullName, email, phoneNumber, gender },
      { new: true },
    );

    if (!updatedUser) {
      throw new ApiError({ statusCode: 404, message: 'User not found' });
    }

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: updatedUser,
        message: 'User profile updated successfully',
      }),
    );
  },
);
