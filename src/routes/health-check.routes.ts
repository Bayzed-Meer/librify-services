import { Router } from 'express';
import * as healthCheckController from '../controllers/health-check.controllers.ts';

const router: Router = Router();

// GET: /api/v1/health-check
router.route('/').get(healthCheckController.getHealthStatus);

export default router;
