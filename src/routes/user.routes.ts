import { Router } from 'express';
import * as userController from '../controllers/user.controllers.ts';
import { verifyToken } from '../middlewares/auth.middlewares.ts';

const router: Router = Router();

// PUT: /api/v1/users/profile
router.route('/profile').put(verifyToken, userController.updateUserProfile);

export default router;
