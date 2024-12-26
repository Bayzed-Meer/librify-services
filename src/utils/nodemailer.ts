import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/smtp-pool';
import { ApiError } from './api-error.ts';

export const sendMail = async (options: MailOptions): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail(options);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new ApiError({ statusCode: 500, message: 'Error sending email' });
  }
};

export const generateOtpHtmlTemplate = (otp: string): string => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
          padding: 0;
          margin: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 30px auto;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          background: #007bff;
          color: #fff;
          padding: 20px;
          text-align: center;
        }
        .email-header h1 {
          margin: 0;
          font-size: 24px;
        }
        .email-body {
          padding: 20px;
        }
        .email-body p {
          margin: 10px 0;
        }
        .otp-box {
          background: #f1f1f1;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          letter-spacing: 2px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .email-footer {
          background: #f1f1f1;
          padding: 10px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>${process.env.COMPANY_NAME} - Password Reset Request</h1>
        </div>
        <div class="email-body">
          <p>Dear user,</p>
          <p>We received a request to reset your password. Please use the following OTP to complete the process:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP will expire in <strong>5 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
          <p>Thank you,<br>The Support Team</p>
        </div>
        <div class="email-footer">
          <p>&copy; ${new Date().getFullYear()} ${process.env.COMPANY_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;
