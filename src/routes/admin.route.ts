import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Master Admin Guard Middleware for all routes in this router
router.use(authenticate, requireRole(['admin']));

router.get('/stats', AdminController.getPlatformStats);

// Campaign Management Workflow
router.get('/campaigns', AdminController.getAllCampaigns);
router.get('/campaigns/pending', AdminController.getPendingCampaigns);
router.patch('/campaigns/:id/status', AdminController.updateCampaignStatus);
router.delete('/campaigns/:id', AdminController.deleteCampaign);

// Withdrawal Approval Workflow
router.get('/withdrawals/pending', AdminController.getPendingWithdrawals);
router.patch('/withdrawals/:id/approve', AdminController.approveWithdrawal);

// User Management Workflow
router.get('/users', AdminController.getAllUsers);
router.patch('/users/:id/role', AdminController.updateUserRole);
router.delete('/users/:id', AdminController.deleteUser);

// Fraud Reports Management Workflow
router.get('/reports', AdminController.getReports);
router.delete('/reports/:id', AdminController.deleteReport);

export default router;
