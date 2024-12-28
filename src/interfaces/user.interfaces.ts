import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  avatar?: string;
  email: string;
  fullName: string;
  gender?: 'male' | 'female';
  isActive: boolean;
  membership?: 'basic' | 'premium';
  password: string;
  phoneNumber?: string;
  refreshToken?: string;
  role: 'member' | 'librarian' | 'admin';
  generateAccessToken(): string;
  generateRefreshToken(): string;
  isPasswordCorrect(password: string): Promise<boolean>;
}
