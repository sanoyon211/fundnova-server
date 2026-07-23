import { Request, Response, NextFunction } from 'express';
import { CampaignService } from '../services/campaign.service.js';
import { createCampaignSchema, updateCampaignSchema } from '../validators/campaign.validator.js';

export class CampaignController {
  static async createCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createCampaignSchema.parse(req.body);
      const user = req.user!;
      const result = await CampaignService.createCampaign(
        String(user._id),
        user.name,
        user.email,
        validatedData
      );

      res.status(201).json({
        success: true,
        message: 'Campaign submitted successfully and is pending admin review',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getApprovedCampaigns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, search } = req.query;
      const campaigns = await CampaignService.getApprovedCampaigns({
        category: typeof category === 'string' ? category : undefined,
        search: typeof search === 'string' ? search : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Approved active campaigns fetched successfully',
        data: campaigns,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTopFundedCampaigns(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaigns = await CampaignService.getTopFundedCampaigns();

      res.status(200).json({
        success: true,
        message: 'Top funded campaigns fetched successfully',
        data: campaigns,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCampaignById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaignId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const campaign = await CampaignService.getCampaignById(campaignId);

      res.status(200).json({
        success: true,
        message: 'Campaign details fetched successfully',
        data: campaign,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCreatorCampaigns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaigns = await CampaignService.getCreatorCampaigns(req.user!.email);

      res.status(200).json({
        success: true,
        message: 'Creator campaigns fetched successfully',
        data: campaigns,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = updateCampaignSchema.parse(req.body);
      const campaignId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const campaign = await CampaignService.updateCampaign(
        campaignId,
        req.user!.email,
        validatedData
      );

      res.status(200).json({
        success: true,
        message: 'Campaign updated successfully',
        data: campaign,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaignId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await CampaignService.deleteCampaign(
        campaignId,
        req.user!.email,
        req.user!.role
      );

      res.status(200).json({
        success: true,
        message: 'Campaign deleted and supporter contributions refunded',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
