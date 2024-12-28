import mongoose, { Schema, Model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces/user.interfaces.ts';

const userSchema: Schema<IUser> = new Schema(
  {
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    membership: {
      type: String,
      enum: ['basic', 'premium'],
      default: 'basic',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ['member', 'librarian', 'admin'],
      default: 'member',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next): Promise<void> {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
