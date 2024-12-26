import { Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  verified: boolean;
  createdAt: Date;
  isOtpCorrect(otp: string): Promise<boolean>;
}
