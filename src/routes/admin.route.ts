import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Master Admin Guard Middleware for all routes in this router
router.use(authenticate, requireRole(['admin']));

router.get('/stats', AdminController.getPlatformStats);

// Campaign Approval Workflow
router.get('/campaigns/pending', AdminController.getPendingCampaigns);
router.patch('/campaigns/:id/status', AdminController.updateCampaignStatus);

// Withdrawal Approval Workflow
router.get('/withdrawals/pending', AdminController.getPendingWithdrawals);
router.patch('/withdrawals/:id/approve', AdminController.approveWithdrawal);

// User Management Workflow
router.get('/users', AdminController.getAllUsers);
router.patch('/users/:id/role', AdminController.updateUserRole);
router.delete('/users/:id', AdminController.deleteUser);

export default router;
