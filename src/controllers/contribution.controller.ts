import { Request, Response, NextFunction } from 'express';
import { ContributionService } from '../services/contribution.service.js';
import { createContributionSchema } from '../validators/contribution.validator.js';

export class ContributionController {
  static async createContribution(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createContributionSchema.parse(req.body);
      const user = req.user!;
      const result = await ContributionService.createContribution(
        user.email,
        user.name,
        validatedData
      );

      res.status(201).json({
        success: true,
        message: 'Contribution pledge submitted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async approveContribution(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contributionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await ContributionService.approveContribution(
        campaignIdToString(contributionId),
        req.user!.email
      );

      res.status(200).json({
        success: true,
        message: 'Contribution approved and campaign raised amount updated',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async rejectContribution(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contributionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await ContributionService.rejectContribution(
        campaignIdToString(contributionId),
        req.user!.email
      );

      res.status(200).json({
        success: true,
        message: 'Contribution rejected and credits refunded to supporter',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSupporterContributions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await ContributionService.getSupporterContributions(
        req.user!.email,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        message: 'Supporter contributions fetched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCreatorPendingContributions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pending = await ContributionService.getCreatorPendingContributions(req.user!.email);

      res.status(200).json({
        success: true,
        message: 'Creator pending contributions fetched successfully',
        data: pending,
      });
    } catch (error) {
      next(error);
    }
  }
}

function campaignIdToString(id: any): string {
  return String(id);
}
