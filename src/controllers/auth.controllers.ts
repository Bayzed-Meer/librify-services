import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { User } from '../models/user.models.ts';
import { OTP } from '../models/otp-models.ts';
import { ApiResponse } from '../utils/api-response.ts';
import { ApiError } from '../utils/api-error.ts';
import * as validator from '../utils/validators.ts';
import { JwtPayload } from '../interfaces/jwt.interfaces.ts';
import { IUser } from '../interfaces/user.interfaces.ts';
import { generateOtp } from '../utils/otp-generator.ts';
import { generateEmailHtmlTemplate, sendMail } from '../utils/nodemailer.ts';
import { IOTP } from '../interfaces/otp-interfaces.ts';
import {
  generateAccessAndRefreshTokens,
  generateResetPasswordToken,
} from '../utils/token-generator.ts';

// export const registerUser = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { email, fullName, gender, password, phoneNumber } = req.body;

//     const missingFields: string[] = [];
//     if (!email?.trim()) missingFields.push('email');
//     if (!fullName?.trim()) missingFields.push('fullName');
//     if (!password?.trim()) missingFields.push('password');

//     if (missingFields.length > 0) {
//       throw new ApiError({
//         statusCode: 400,
//         message: `Required fields are missing: ${missingFields.join(', ')}`,
//       });
//     }

//     if (!validator.isValidEmail(email)) {
//       throw new ApiError({
//         statusCode: 400,
//         message: 'Invalid email address!',
//       });
//     }

//     if (!validator.isStrongPassword(password)) {
//       throw new ApiError({
//         statusCode: 400,
//         message:
//           'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
//       });
//     }

//     const existedUser: IUser | null = await User.findOne({
//       email: email.toLowerCase(),
//     });

//     if (existedUser) {
//       throw new ApiError({
//         statusCode: 409,
//         message: 'User with email already exists',
//       });
//     }

//     // Delete existing OTP for the email if any
//     await OTP.deleteOne({ email });
//     const otp = generateOtp();
//     await OTP.create({
//       email,
//       otp,
//       verified: false,
//       data: { fullName, gender, password, phoneNumber },
//     });

//     await sendMail({
//       to: email,
//       subject: 'Verify Your Account - OTP',
//       html: generateEmailHtmlTemplate({
//         message:
//           'Use the OTP below to verify your email and complete registration:',
//         otp,
//       }),
//     });

//     res.status(200).json(
//       new ApiResponse({
//         statusCode: 200,
//         data: {},
//         message:
//           'OTP sent successfully. Please verify to complete registration.',
//       }),
//     );
//   },
// );

// export const verifyOtpAndRegister = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { email, otp } = req.body;

//     if (!otp || !email) {
//       throw new ApiError({
//         statusCode: 400,
//         message: 'OTP and email are required',
//       });
//     }

//     const otpRecord: IOTP | null = await OTP.findOne({ email });

//     if (!otpRecord) {
//       throw new ApiError({
//         statusCode: 400,
//         message: 'Invalid or expired OTP',
//       });
//     }

//     const isOtpCorrect = await otpRecord.isOtpCorrect(otp);

//     if (!isOtpCorrect) {
//       throw new ApiError({ statusCode: 400, message: 'Invalid OTP' });
//     }

//     const { fullName, gender, password, phoneNumber } = otpRecord.data;

//     const user: IUser | null = await User.create({
//       email,
//       fullName,
//       gender,
//       password,
//       phoneNumber,
//     });

//     if (!user) {
//       throw new ApiError({
//         statusCode: 500,
//         message: 'Something went wrong while creating the user',
//       });
//     }

//     await OTP.deleteOne({ email });

//     const createdUser: IUser | null = await User.findById(user._id);

//     if (!createdUser) {
//       throw new ApiError({
//         statusCode: 500,
//         message: 'Something went wrong while registering the user',
//       });
//     }

//     const tokens: { accessToken: string; refreshToken: string } | null =
//       await generateAccessAndRefreshTokens(createdUser._id);

//     if (!tokens) {
//       throw new ApiError({
//         statusCode: 500,
//         message: 'Failed to generate tokens',
//       });
//     }
//     const { accessToken, refreshToken } = tokens;

//     res
//       .status(201)
//       .cookie('accessToken', accessToken, {
//         httpOnly: true,
//         secure: true,
//       })
//       .cookie('refreshToken', refreshToken, {
//         httpOnly: true,
//         secure: true,
//         sameSite: 'strict',
//         expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//       })
//       .json(
//         new ApiResponse({
//           statusCode: 200,
//           data: { createdUser, accessToken, refreshToken },
//           message: 'User registered Successfully',
//         }),
//       );
//   },
// );

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, fullName, gender, password, phoneNumber } = req.body;

    const missingFields: string[] = [];
    if (!email?.trim()) missingFields.push('email');
    if (!fullName?.trim()) missingFields.push('fullName');
    if (!password?.trim()) missingFields.push('password');

    if (missingFields.length > 0) {
      throw new ApiError({
        statusCode: 400,
        message: `Required fields are missing: ${missingFields.join(', ')}`,
      });
    }

    if (!validator.isValidEmail(email)) {
      throw new ApiError({
        statusCode: 400,
        message: 'Invalid email address!',
      });
    }

    if (!validator.isStrongPassword(password)) {
      throw new ApiError({
        statusCode: 400,
        message:
          'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
    }

    const existedUser: IUser | null = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existedUser) {
      throw new ApiError({
        statusCode: 409,
        message: 'User with email already exists',
      });
    }

    const user: IUser | null = await User.create({
      email,
      fullName,
      gender,
      password,
      phoneNumber,
    });

    const createdUser: IUser | null = await User.findById(user._id).select(
      '-role',
    );

    if (!createdUser) {
      throw new ApiError({
        statusCode: 500,
        message: 'Something went wrong while registering the user',
      });
    }

    const tokens: { accessToken: string; refreshToken: string } | null =
      await generateAccessAndRefreshTokens(createdUser._id);

    if (!tokens) {
      throw new ApiError({
        statusCode: 500,
        message: 'Failed to generate tokens',
      });
    }
    const { accessToken, refreshToken } = tokens;

    res
      .status(201)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .json(
        new ApiResponse({
          statusCode: 200,
          data: { createdUser, accessToken, refreshToken },
          message: 'User registered Successfully',
        }),
      );
  },
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError({ statusCode: 400, message: 'Email is required' });
  }

  if (!password) {
    throw new ApiError({ statusCode: 400, message: 'Password is required' });
  }

  const user: IUser | null = await User.findOne({
    email,
  }).select('+password');

  if (!user) {
    throw new ApiError({ statusCode: 404, message: 'User does not exist' });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError({
      statusCode: 401,
      message: 'Invalid user credentials',
    });
  }

  const tokens: { accessToken: string; refreshToken: string } | null =
    await generateAccessAndRefreshTokens(user._id);

  if (!tokens) {
    throw new ApiError({
      statusCode: 500,
      message: 'Failed to generate tokens',
    });
  }
  const { accessToken, refreshToken } = tokens;

  const loggedInUser: IUser | null = await User.findById(user._id).select(
    '-role',
  );

  res
    .status(201)
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    .json(
      new ApiResponse({
        statusCode: 200,
        data: { loggedInUser, accessToken, refreshToken },
        message: 'User logged in Successfully',
      }),
    );
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;

  await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(
      new ApiResponse({
        statusCode: 200,
        data: {},
        message: 'User logged out successfully',
      }),
    );
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError({ statusCode: 401, message: 'Unauthorized request' });
    }

    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
      ) as JwtPayload;
    } catch (error) {
      throw new ApiError({
        statusCode: 401,
        message: 'Invalid refresh token',
        errors: error,
      });
    }

    const user: IUser | null = await User.findById(decodedToken._id).select(
      '+refreshToken',
    );

    if (!user) {
      throw new ApiError({ statusCode: 401, message: 'User not found' });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError({
        statusCode: 401,
        message: 'Refresh token is expired or invalid',
      });
    }

    const tokens: { accessToken: string; refreshToken: string } | null =
      await generateAccessAndRefreshTokens(user._id);

    if (!tokens) {
      throw new ApiError({
        statusCode: 500,
        message: 'Failed to generate tokens',
      });
    }
    const { accessToken, refreshToken } = tokens;

    res
      .status(201)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .json(
        new ApiResponse({
          statusCode: 200,
          data: { accessToken, refreshToken },
          message: 'Access token refreshed successfully',
        }),
      );
  },
);

export const changeCurrentPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user: IUser | null = await User.findById(userId).select('+password');

    if (!user) {
      throw new ApiError({ statusCode: 404, message: 'User not found' });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError({ statusCode: 400, message: 'Invalid old password' });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: {},
        message: 'Password changed successfully',
      }),
    );
  },
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError({ statusCode: 400, message: 'Email is required' });
    }

    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      throw new ApiError({ statusCode: 404, message: 'User not found' });
    }

    await OTP.deleteOne({ email });

    const otp = generateOtp();

    await OTP.create({
      email,
      otp,
    });

    await sendMail({
      to: email,
      subject: 'Your Password Reset OTP',
      html: generateEmailHtmlTemplate({
        message:
          'We received a request to reset your password. Use the OTP below:',
        otp,
      }),
    });

    const resetPasswordToken = await generateResetPasswordToken(email);

    res
      .status(200)
      .cookie('resetPasswordToken', resetPasswordToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 30 * 60 * 1000),
      })
      .json(
        new ApiResponse({
          statusCode: 200,
          data: {},
          message: 'OTP sent successfully',
        }),
      );
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { password } = req.body;
    const { email } = req.user;

    if (!password) {
      throw new ApiError({
        statusCode: 400,
        message: 'Password is required',
      });
    }

    const otpData = await OTP.findOne({ email });

    if (!otpData || !otpData.verified) {
      throw new ApiError({ statusCode: 400, message: 'Invalid OTP' });
    }

    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      throw new ApiError({ statusCode: 404, message: 'User not found' });
    }

    user.password = password;
    await user.save({ validateBeforeSave: false });

    await OTP.deleteOne({ email });

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: {},
        message: 'Password reset successfully',
      }),
    );
  },
);

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { otp } = req.body;
  const { email } = req.user;

  if (!otp) {
    throw new ApiError({
      statusCode: 400,
      message: 'OTP is required',
    });
  }

  const Otp: IOTP | null = await OTP.findOne({ email });

  if (!Otp) {
    throw new ApiError({ statusCode: 400, message: 'Invalid OTP' });
  }

  const isOtpCorrect = await Otp.isOtpCorrect(otp);

  if (!isOtpCorrect) {
    throw new ApiError({ statusCode: 400, message: 'Invalid OTP' });
  }

  Otp.verified = true;
  await Otp.save({ validateBeforeSave: false });

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {},
      message: 'OTP verified successfully',
    }),
  );
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.user;

  await OTP.deleteOne({ email });

  const otp = generateOtp();

  await OTP.create({
    email,
    otp,
  });

  await sendMail({
    to: email,
    subject: 'Your OTP Code',
    html: generateEmailHtmlTemplate({
      message: 'Here is your OTP code to verify your account.',
      otp,
    }),
  });

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {},
      message: 'OTP resend successfully',
    }),
  );
});
