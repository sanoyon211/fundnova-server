import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Supporter report campaign route
router.post(
  '/',
  authenticate,
  requireRole(['supporter', 'creator', 'admin']),
  ReportController.createReport
);

export default router;
