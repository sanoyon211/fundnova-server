import { Router } from 'express';
import { CampaignController } from '../controllers/campaign.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Public Routes
router.get('/', CampaignController.getApprovedCampaigns);
router.get('/top-funded', CampaignController.getTopFundedCampaigns);
router.get('/:id', CampaignController.getCampaignById);

// Protected Routes (Creator / Admin)
router.post(
  '/',
  authenticate,
  requireRole(['creator', 'admin']),
  CampaignController.createCampaign
);

router.get(
  '/my-campaigns/creator',
  authenticate,
  requireRole(['creator', 'admin']),
  CampaignController.getCreatorCampaigns
);

router.patch(
  '/:id',
  authenticate,
  requireRole(['creator', 'admin']),
  CampaignController.updateCampaign
);

router.delete(
  '/:id',
  authenticate,
  requireRole(['creator', 'admin']),
  CampaignController.deleteCampaign
);

export default router;
