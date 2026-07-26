import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all admin routes with authentication and admin role restriction
router.use(protect, restrictTo('admin'));

// Overview & Analytics
router.get('/stats', AdminController.getPlatformStats);

// Campaign Moderation & Management
router.get('/campaigns', AdminController.getAllCampaigns);
router.get('/campaigns/pending', AdminController.getPendingCampaigns);
router.patch('/campaigns/:id/status', AdminController.updateCampaignStatus);
router.delete('/campaigns/:id', AdminController.deleteCampaign);

// Creator Withdrawal Requests
router.get('/withdrawals/pending', AdminController.getPendingWithdrawals);
router.patch('/withdrawals/:id/approve', AdminController.approveWithdrawal);

// User Accounts Management
router.get('/users', AdminController.getAllUsers);
router.patch('/users/:id/role', AdminController.updateUserRole);
router.delete('/users/:id', AdminController.deleteUser);

// Fraud Reports Management
router.get('/reports', AdminController.getReports);
router.delete('/reports/:id', AdminController.deleteReport);

export default router;
