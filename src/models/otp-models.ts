import mongoose, { Model, Schema } from 'mongoose';
import { IOTP } from '../interfaces/otp-interfaces.ts';
import bcrypt from 'bcryptjs';

const OTPSchema: Schema<IOTP> = new Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

OTPSchema.pre('save', async function (next): Promise<void> {
  if (!this.isModified('otp')) return next();

  this.otp = await bcrypt.hash(this.otp, 10);
  next();
});

OTPSchema.methods.isOtpCorrect = async function (
  otp: string,
): Promise<boolean> {
  return bcrypt.compare(otp, this.otp);
};

export const OTP: Model<IOTP> = mongoose.model<IOTP>('OTP', OTPSchema);
