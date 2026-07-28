import { Router } from 'express';
import { ContributionController } from '../controllers/contribution.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Supporter Routes
router.post(
  '/',
  authenticate,
  requireRole(['supporter', 'admin']),
  ContributionController.createContribution
);

router.get(
  '/supporter',
  authenticate,
  requireRole(['supporter', 'admin']),
  ContributionController.getSupporterContributions
);

// Creator Routes
router.get(
  '/creator/pending',
  authenticate,
  requireRole(['creator', 'admin']),
  ContributionController.getCreatorPendingContributions
);

router.patch(
  '/:id/approve',
  authenticate,
  requireRole(['creator', 'admin']),
  ContributionController.approveContribution
);

router.patch(
  '/:id/reject',
  authenticate,
  requireRole(['creator', 'admin']),
  ContributionController.rejectContribution
);

export default router;
