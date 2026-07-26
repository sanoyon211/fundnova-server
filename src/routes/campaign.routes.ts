import { Router } from 'express';
import {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCreatorCampaigns,
} from '../controllers/campaign.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

// Public Routes
router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);

// Protected Routes
router.get('/my-campaigns/creator', protect, getCreatorCampaigns);
router.get('/my-campaigns', protect, getCreatorCampaigns);
router.post('/', protect, restrictTo('creator', 'admin'), createCampaign);
router.patch('/:id', protect, updateCampaign);
router.delete('/:id', protect, deleteCampaign);

export default router;
