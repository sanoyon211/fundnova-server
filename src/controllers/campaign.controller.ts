import { Request, Response, NextFunction } from 'express';
import { Campaign } from '../models/campaign.model.js';
import { AppError } from '../errors/app-error.js';

export const createCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      throw new AppError('User authentication required', 401);
    }

    const {
      title,
      description,
      story,
      goalAmount,
      fundingGoal,
      raisedAmount,
      amountRaised,
      deadline,
      category,
      coverImage,
      imageUrl,
    } = req.body;

    const campaignData = {
      title,
      description: description || story,
      goalAmount: goalAmount ?? fundingGoal,
      raisedAmount: raisedAmount ?? amountRaised ?? 0,
      creator: userId,
      deadline: new Date(deadline),
      category,
      coverImage: coverImage || imageUrl,
      creatorName: req.user?.name || '',
      creatorEmail: req.user?.email || '',
    };

    const campaign = await Campaign.create(campaignData);

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCampaigns = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, search, sort, status } = req.query;

    const filter: any = {};

    if (category && category !== 'All' && typeof category === 'string') {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search && typeof search === 'string') {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { story: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && typeof status === 'string') {
      filter.status = status;
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'most_funded') {
      sortOptions = { raisedAmount: -1, amountRaised: -1, createdAt: -1 };
    } else if (sort === 'least_funded') {
      sortOptions = { raisedAmount: 1, amountRaised: 1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const campaigns = await Campaign.find(filter)
      .populate('creator', 'name avatar')
      .sort(sortOptions);

    res.status(200).json({
      success: true,
      message: 'Campaigns fetched successfully',
      data: campaigns,
    });
  } catch (error) {
    next(error);
  }
};

export const getCampaignById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const campaignId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const campaign = await Campaign.findById(campaignId).populate('creator', 'name avatar');

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Campaign details fetched successfully',
      data: campaign,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const campaignId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    const currentUserId = req.user?._id?.toString() || req.user?.id?.toString();
    const creatorId = campaign.creator ? campaign.creator.toString() : '';
    const isAdmin = req.user?.role === 'admin';

    if (currentUserId !== creatorId && !isAdmin) {
      throw new AppError('Forbidden: You are not authorized to update this campaign', 403);
    }

    // Map input fields
    if (req.body.title) campaign.title = req.body.title;
    if (req.body.description || req.body.story) {
      campaign.description = req.body.description || req.body.story;
    }
    if (req.body.goalAmount ?? req.body.fundingGoal) {
      campaign.goalAmount = req.body.goalAmount ?? req.body.fundingGoal;
    }
    if (req.body.category) campaign.category = req.body.category;
    if (req.body.coverImage || req.body.imageUrl) {
      campaign.coverImage = req.body.coverImage || req.body.imageUrl;
    }
    if (req.body.deadline) campaign.deadline = new Date(req.body.deadline);
    if (req.body.status) campaign.status = req.body.status;

    const updatedCampaign = await campaign.save();

    res.status(200).json({
      success: true,
      message: 'Campaign updated successfully',
      data: updatedCampaign,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const campaignId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    const currentUserId = req.user?._id?.toString() || req.user?.id?.toString();
    const creatorId = campaign.creator ? campaign.creator.toString() : '';
    const isAdmin = req.user?.role === 'admin';

    if (currentUserId !== creatorId && !isAdmin) {
      throw new AppError('Forbidden: You are not authorized to delete this campaign', 403);
    }

    await Campaign.findByIdAndDelete(campaignId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Additional helper controllers
export const getApprovedCampaigns = getAllCampaigns;
export const getTopFundedCampaigns = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const campaigns = await Campaign.find({ status: { $in: ['active', 'approved'] } })
      .populate('creator', 'name avatar')
      .sort({ raisedAmount: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      message: 'Top funded campaigns fetched successfully',
      data: campaigns,
    });
  } catch (error) {
    next(error);
  }
};

export const getCreatorCampaigns = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id || req.user?.id;
    const campaigns = await Campaign.find({
      $or: [{ creator: userId }, { creatorEmail: req.user?.email }],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Creator campaigns fetched successfully',
      data: campaigns,
    });
  } catch (error) {
    next(error);
  }
};

export class CampaignController {
  static createCampaign = createCampaign;
  static getAllCampaigns = getAllCampaigns;
  static getCampaignById = getCampaignById;
  static updateCampaign = updateCampaign;
  static deleteCampaign = deleteCampaign;
  static getApprovedCampaigns = getApprovedCampaigns;
  static getTopFundedCampaigns = getTopFundedCampaigns;
  static getCreatorCampaigns = getCreatorCampaigns;
}
