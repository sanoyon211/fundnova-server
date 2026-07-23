import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import { UserRole } from '../types/user.types.js';

export class AdminController {
  static async getPlatformStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await AdminService.getPlatformStats();

      res.status(200).json({
        success: true,
        message: 'Platform statistics fetched successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPendingCampaigns(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaigns = await AdminService.getPendingCampaigns();

      res.status(200).json({
        success: true,
        message: 'Pending campaigns fetched successfully',
        data: campaigns,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCampaignStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaignId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { status } = req.body;
      const campaign = await AdminService.updateCampaignStatus(
        String(campaignId),
        status as 'approved' | 'rejected'
      );

      res.status(200).json({
        success: true,
        message: `Campaign status updated to ${status}`,
        data: campaign,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPendingWithdrawals(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const withdrawals = await AdminService.getPendingWithdrawals();

      res.status(200).json({
        success: true,
        message: 'Pending withdrawal requests fetched successfully',
        data: withdrawals,
      });
    } catch (error) {
      next(error);
    }
  }

  static async approveWithdrawal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const withdrawalId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await AdminService.approveWithdrawal(String(withdrawalId));

      res.status(200).json({
        success: true,
        message: 'Withdrawal request approved and creator raised credits deducted',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await AdminService.getAllUsers();

      res.status(200).json({
        success: true,
        message: 'All platform users fetched successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { role } = req.body;
      const user = await AdminService.updateUserRole(String(userId), role as UserRole);

      res.status(200).json({
        success: true,
        message: `User role updated to ${role}`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await AdminService.deleteUser(String(userId));

      res.status(200).json({
        success: true,
        message: 'User account removed from database successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
