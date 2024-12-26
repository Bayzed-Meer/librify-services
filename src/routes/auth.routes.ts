import { Router } from 'express';
import * as authController from '../controllers/auth.controllers.ts';
import {
  verifyResetPasswordToken,
  verifyToken,
} from '../middlewares/auth.middlewares.ts';

const router: Router = Router();

// POST: /api/v1/auth/register
router.route('/register').post(authController.registerUser);
// POST: /api/v1/auth/login
router.route('/login').post(authController.loginUser);
// POST: /api/v1/auth/logout
router.route('/logout').post(verifyToken, authController.logoutUser);
// POST: /api/v1/auth/refresh-token
router.route('/refresh-token').post(authController.refreshAccessToken);
// POST: /api/v1/auth/change-password
router
  .route('/change-password')
  .post(verifyToken, authController.changeCurrentPassword);
// POST: /api/v1/auth/forgot-password
router.route('/forgot-password').post(authController.forgotPassword);
// POST: /api/v1/auth/reset-password
router
  .route('/reset-password')
  .post(verifyResetPasswordToken, authController.resetPassword);
// POST: /api/v1/auth/verify-otp
router
  .route('/verify-otp')
  .post(verifyResetPasswordToken, authController.verifyOtp);
// POST: /api/v1/auth/resend-otp
router
  .route('/resend-otp')
  .post(verifyResetPasswordToken, authController.resendOtp);

export default router;
