import { Request, Response, NextFunction } from 'express';
import { Pledge } from '../models/pledge.model.js';
import { Campaign } from '../models/campaign.model.js';
import { AppError } from '../errors/app-error.js';

export const createPledge = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      throw new AppError('Authentication required to make a pledge', 401);
    }

    const { campaignId, campaign: campaignIdBody, amount, transactionId } = req.body;
    const targetCampaignId = campaignId || campaignIdBody;

    if (!targetCampaignId) {
      throw new AppError('Campaign ID is required', 400);
    }

    if (!amount || amount <= 0) {
      throw new AppError('Pledge amount must be greater than 0', 400);
    }

    const campaign = await Campaign.findById(targetCampaignId);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    const pledge = await Pledge.create({
      campaign: targetCampaignId,
      supporter: userId,
      amount,
      status: 'completed',
      transactionId: transactionId || `TXN_${Date.now()}`,
    });

    // Atomically update campaign's raisedAmount
    await Campaign.findByIdAndUpdate(targetCampaignId, {
      $inc: { raisedAmount: amount },
    });

    res.status(201).json({
      success: true,
      message: 'Pledge placed successfully',
      data: pledge,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPledges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      throw new AppError('Authentication required to view pledges', 401);
    }

    const pledges = await Pledge.find({ supporter: userId })
      .populate('campaign', 'title coverImage status goalAmount raisedAmount description')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User pledges fetched successfully',
      data: pledges,
    });
  } catch (error) {
    next(error);
  }
};

export const getCampaignPledges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const campaignId = Array.isArray(req.params.campaignId)
      ? req.params.campaignId[0]
      : req.params.campaignId;

    const pledges = await Pledge.find({ campaign: campaignId })
      .populate('supporter', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Campaign backers fetched successfully',
      data: pledges,
    });
  } catch (error) {
    next(error);
  }
};

export class PledgeController {
  static createPledge = createPledge;
  static getUserPledges = getUserPledges;
  static getCampaignPledges = getCampaignPledges;
}
