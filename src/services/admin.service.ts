import { User } from '../models/user.model.js';
import { Campaign } from '../models/campaign.model.js';
import { Withdrawal } from '../models/withdrawal.model.js';
import { Payment } from '../models/payment.model.js';
import { Notification } from '../models/notification.model.js';
import { AppError } from '../errors/app-error.js';
import { UserRole } from '../types/user.types.js';

export class AdminService {
  static async getPlatformStats() {
    const [totalSupporters, totalCreators, userCreditsAgg, totalPaymentsAgg] = await Promise.all([
      User.countDocuments({ role: 'supporter' }),
      User.countDocuments({ role: 'creator' }),
      User.aggregate([{ $group: { _id: null, totalCredits: { $sum: '$credits' } } }]),
      Payment.aggregate([{ $match: { status: 'succeeded' } }, { $group: { _id: null, totalAmount: { $sum: '$amount' } } }]),
    ]);

    return {
      totalSupporters,
      totalCreators,
      totalAvailableCredits: userCreditsAgg[0]?.totalCredits || 0,
      totalPaymentsProcessed: totalPaymentsAgg[0]?.totalAmount || 0,
    };
  }

  static async getPendingCampaigns() {
    const campaigns = await Campaign.find({ status: 'pending' }).sort({ createdAt: -1 });
    return campaigns;
  }

  static async updateCampaignStatus(campaignId: string, status: 'approved' | 'rejected') {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    campaign.status = status;
    await campaign.save();

    // Create notification for creator
    await Notification.create({
      message: `Your campaign "${campaign.title}" has been ${status} by the platform administrator.`,
      toEmail: campaign.creatorEmail,
      actionRoute: '/dashboard/creator/my-campaigns',
    });

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

    // Mark withdrawal request as approved
    withdrawal.status = 'approved';
    await withdrawal.save();

    // Business Logic: Deduct creator's raised credits on success
    const creator = await User.findOne({ email: withdrawal.creatorEmail });
    if (creator) {
      creator.raisedCredits = Math.max(0, (creator.raisedCredits || 0) - withdrawal.withdrawalCredit);
      await creator.save();
    }

    // Send notification to creator
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
}
