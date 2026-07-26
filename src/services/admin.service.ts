import { User } from '../models/user.model.js';
import { Campaign } from '../models/campaign.model.js';
import { Withdrawal } from '../models/withdrawal.model.js';
import { Payment } from '../models/payment.model.js';
import { Pledge } from '../models/pledge.model.js';
import { Notification } from '../models/notification.model.js';
import { Report } from '../models/report.model.js';
import { AppError } from '../errors/app-error.js';
import { UserRole } from '../types/user.types.js';
import { sendCampaignStatusUpdate } from '../utils/email.js';

export class AdminService {
  static async getPlatformStats() {
    const [totalUsers, totalCampaigns, totalPledgesAgg, totalPaymentsAgg, totalSupporters, totalCreators] =
      await Promise.all([
        User.countDocuments(),
        Campaign.countDocuments(),
        Pledge.aggregate([{ $group: { _id: null, totalPledges: { $sum: '$amount' } } }]),
        Payment.aggregate([
          { $match: { status: 'succeeded' } },
          { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
        ]),
        User.countDocuments({ role: 'supporter' }),
        User.countDocuments({ role: 'creator' }),
      ]);

    return {
      totalUsers,
      totalCampaigns,
      totalPledgesVolume: totalPledgesAgg[0]?.totalPledges || 0,
      totalRevenue: totalPaymentsAgg[0]?.totalAmount || 0,
      totalSupporters,
      totalCreators,
      totalAvailableCredits: (await User.aggregate([{ $group: { _id: null, sum: { $sum: '$credits' } } }]))[0]?.sum || 0,
      totalPaymentsProcessed: totalPaymentsAgg[0]?.totalAmount || 0,
    };
  }

  static async getPendingCampaigns() {
    const campaigns = await Campaign.find({ status: 'pending' }).sort({ createdAt: -1 });
    return campaigns;
  }

  static async getAllCampaigns() {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    return campaigns;
  }

  static async updateCampaignStatus(
    campaignId: string,
    status: 'approved' | 'rejected' | 'active' | 'closed' | 'suspended'
  ) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    campaign.status = status as any;
    await campaign.save();

    const recipientEmail =
      campaign.creatorEmail ||
      (typeof campaign.creator === 'object' && (campaign.creator as any)?.email
        ? (campaign.creator as any).email
        : '');

    // Create notification record for creator
    await Notification.create({
      message: `Your campaign "${campaign.title}" has been ${status} by the platform administrator.`,
      toEmail: recipientEmail || 'creator@fundnova.io',
      actionRoute: '/dashboard/creator/my-campaigns',
    });

    // Send transactional status update email asynchronously (non-blocking)
    if (recipientEmail) {
      sendCampaignStatusUpdate(recipientEmail, campaign.title, status).catch((err) => {
        console.warn('[Email non-blocking error]:', err);
      });
    }

    return campaign;
  }

  static async getPendingWithdrawals() {
    const withdrawals = await Withdrawal.find({ status: 'pending' }).sort({ createdAt: -1 });
    return withdrawals;
  }

  static async approveWithdrawal(withdrawalId: string) {
    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      throw new AppError('Withdrawal request record not found', 404);
    }

    if (withdrawal.status !== 'pending') {
      throw new AppError(`Withdrawal request is already ${withdrawal.status}`, 400);
    }

    withdrawal.status = 'approved';
    await withdrawal.save();

    const creator = await User.findOne({ email: withdrawal.creatorEmail });
    if (creator) {
      creator.raisedCredits = Math.max(0, (creator.raisedCredits || 0) - withdrawal.withdrawalCredit);
      await creator.save();
    }

    await Notification.create({
      message: `Your withdrawal request of ${withdrawal.withdrawalCredit} credits ($${withdrawal.withdrawalAmount}) via ${withdrawal.paymentSystem} was approved and processed successfully!`,
      toEmail: withdrawal.creatorEmail,
      actionRoute: '/dashboard/creator/payment-history',
    });

    return withdrawal;
  }

  static async getAllUsers() {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return users;
  }

  static async updateUserRole(userId: string, newRole: UserRole) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.role = newRole;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  static async deleteUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await User.findByIdAndDelete(userId);
    return { id: userId, deleted: true };
  }

  static async getReports() {
    const reports = await Report.find().sort({ createdAt: -1 });
    return reports;
  }

  static async deleteReport(reportId: string) {
    const report = await Report.findById(reportId);
    if (!report) {
      throw new AppError('Report not found', 404);
    }

    await Report.findByIdAndDelete(reportId);
    return { id: reportId, deleted: true };
  }
}
