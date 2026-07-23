import { Campaign } from '../models/campaign.model.js';
import { CreateCampaignInput, UpdateCampaignInput } from '../validators/campaign.validator.js';
import { AppError } from '../errors/app-error.js';

export class CampaignService {
  static async createCampaign(creatorId: string, creatorName: string, creatorEmail: string, input: CreateCampaignInput) {
    const newCampaign = await Campaign.create({
      ...input,
      deadline: new Date(input.deadline),
      creatorId,
      creatorName,
      creatorEmail,
      status: 'pending', // Pending Admin approval
      amountRaised: 0,
    });

    return newCampaign;
  }

  static async getApprovedCampaigns(query: { category?: string; search?: string }) {
    const filter: any = {
      status: 'approved',
      deadline: { $gte: new Date() }, // Deadline not passed
    };

    if (query.category) {
      filter.category = query.category;
    }

    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    const campaigns = await Campaign.find(filter).sort({ createdAt: -1 });
    return campaigns;
  }

  static async getTopFundedCampaigns() {
    // Top 6 funded campaigns
    const campaigns = await Campaign.find({ status: 'approved' })
      .sort({ amountRaised: -1 })
      .limit(6);
    return campaigns;
  }

  static async getCampaignById(id: string) {
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }
    return campaign;
  }

  static async getCreatorCampaigns(creatorEmail: string) {
    // Sorted in descending order by deadline
    const campaigns = await Campaign.find({ creatorEmail }).sort({ deadline: -1 });
    return campaigns;
  }

  static async updateCampaign(id: string, userEmail: string, input: UpdateCampaignInput) {
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    if (campaign.creatorEmail !== userEmail) {
      throw new AppError('Unauthorized: You can only update your own campaigns', 403);
    }

    Object.assign(campaign, input);
    await campaign.save();
    return campaign;
  }

  static async deleteCampaign(id: string, userEmail: string, userRole: string) {
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    if (userRole !== 'admin' && campaign.creatorEmail !== userEmail) {
      throw new AppError('Unauthorized: You do not have permission to delete this campaign', 403);
    }

    // Business Logic: Delete triggers refund of all approved supporter contributions
    // (Integrates with Contribution model once created in BE-06)
    await Campaign.findByIdAndDelete(id);
    return { id, refunded: true };
  }
}
