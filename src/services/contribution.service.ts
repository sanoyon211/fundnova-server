import { Contribution } from '../models/contribution.model.js';
import { Campaign } from '../models/campaign.model.js';
import { User } from '../models/user.model.js';
import { Notification } from '../models/notification.model.js';
import { CreateContributionInput } from '../validators/contribution.validator.js';
import { AppError } from '../errors/app-error.js';

export class ContributionService {
  static async createContribution(supporterEmail: string, supporterName: string, input: CreateContributionInput) {
    // Verify campaign existence
    const campaign = await Campaign.findById(input.campaignId);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    if (campaign.status !== 'approved') {
      throw new AppError('Cannot contribute to an unapproved campaign', 400);
    }

    if (new Date(campaign.deadline) < new Date()) {
      throw new AppError('Campaign deadline has passed', 400);
    }

    if (input.contributionAmount < campaign.minimumContribution) {
      throw new AppError(
        `Minimum contribution for this campaign is ${campaign.minimumContribution} credits`,
        400
      );
    }

    // Verify supporter credits balance
    const supporter = await User.findOne({ email: supporterEmail });
    if (!supporter) {
      throw new AppError('Supporter user account not found', 404);
    }

    if (supporter.credits < input.contributionAmount) {
      throw new AppError(
        `Insufficient credit balance. You need ${input.contributionAmount} credits but have ${supporter.credits} credits.`,
        400
      );
    }

    // Deduct credits from supporter's balance
    supporter.credits -= input.contributionAmount;
    await supporter.save();

    // Create pending pledge
    const contribution = await Contribution.create({
      campaignId: campaign._id,
      campaignTitle: campaign.title,
      contributionAmount: input.contributionAmount,
      supporterEmail,
      supporterName,
      creatorEmail: campaign.creatorEmail,
      creatorName: campaign.creatorName,
      status: 'pending',
    });

    // Create notification for creator
    await Notification.create({
      message: `${supporterName} pledged ${input.contributionAmount} credits to your campaign "${campaign.title}"`,
      toEmail: campaign.creatorEmail,
      actionRoute: '/dashboard/creator',
    });

    return contribution;
  }

  static async approveContribution(contributionId: string, creatorEmail: string) {
    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      throw new AppError('Contribution record not found', 404);
    }

    if (contribution.creatorEmail !== creatorEmail) {
      throw new AppError('Unauthorized: You are not the creator of this campaign', 403);
    }

    if (contribution.status !== 'pending') {
      throw new AppError(`Contribution is already ${contribution.status}`, 400);
    }

    // Approve pledge
    contribution.status = 'approved';
    await contribution.save();

    // Increase campaign amountRaised
    const campaign = await Campaign.findById(contribution.campaignId);
    if (campaign) {
      campaign.amountRaised += contribution.contributionAmount;
      await campaign.save();

      // Also increase creator's raised credits counter
      const creator = await User.findOne({ email: creatorEmail });
      if (creator) {
        creator.raisedCredits = (creator.raisedCredits || 0) + contribution.contributionAmount;
        await creator.save();
      }
    }

    // Create notification for supporter
    await Notification.create({
      message: `Your Contribution of ${contribution.contributionAmount} credits to "${contribution.campaignTitle}" was approved by ${contribution.creatorName}`,
      toEmail: contribution.supporterEmail,
      actionRoute: '/dashboard/supporter',
    });

    return contribution;
  }

  static async rejectContribution(contributionId: string, creatorEmail: string) {
    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      throw new AppError('Contribution record not found', 404);
    }

    if (contribution.creatorEmail !== creatorEmail) {
      throw new AppError('Unauthorized: You are not the creator of this campaign', 403);
    }

    if (contribution.status !== 'pending') {
      throw new AppError(`Contribution is already ${contribution.status}`, 400);
    }

    // Reject pledge
    contribution.status = 'rejected';
    await contribution.save();

    // Refund pledged credits back to supporter's balance
    const supporter = await User.findOne({ email: contribution.supporterEmail });
    if (supporter) {
      supporter.credits += contribution.contributionAmount;
      await supporter.save();
    }

    // Create notification for supporter
    await Notification.create({
      message: `Your Contribution of ${contribution.contributionAmount} credits to "${contribution.campaignTitle}" was rejected by ${contribution.creatorName} and refunded to your credits balance.`,
      toEmail: contribution.supporterEmail,
      actionRoute: '/dashboard/supporter',
    });

    return contribution;
  }

  static async getSupporterContributions(supporterEmail: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [contributions, total] = await Promise.all([
      Contribution.find({ supporterEmail })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Contribution.countDocuments({ supporterEmail }),
    ]);

    return {
      contributions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCreatorPendingContributions(creatorEmail: string) {
    const pendingContributions = await Contribution.find({
      creatorEmail,
      status: 'pending',
    }).sort({ createdAt: -1 });

    return pendingContributions;
  }
}
