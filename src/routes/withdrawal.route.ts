import { Router } from 'express';
import { WithdrawalController } from '../controllers/withdrawal.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.post(
  '/',
  authenticate,
  requireRole(['creator', 'admin']),
  WithdrawalController.createWithdrawalRequest
);

router.get(
  '/creator',
  authenticate,
  requireRole(['creator', 'admin']),
  WithdrawalController.getCreatorWithdrawals
);

export default router;
