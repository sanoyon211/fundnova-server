import { Router } from 'express';
import {
  createPledge,
  getUserPledges,
  getCampaignPledges,
} from '../controllers/pledge.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Protected Routes
router.post('/', protect, createPledge);
router.get('/my-pledges', protect, getUserPledges);

// Public Routes
router.get('/campaign/:campaignId', getCampaignPledges);

export default router;
