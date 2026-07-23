import { Withdrawal } from '../models/withdrawal.model.js';
import { User } from '../models/user.model.js';
import { Notification } from '../models/notification.model.js';
import { CreateWithdrawalInput } from '../validators/withdrawal.validator.js';
import { AppError } from '../errors/app-error.js';

export class WithdrawalService {
  static async createWithdrawalRequest(
    creatorEmail: string,
    creatorName: string,
    input: CreateWithdrawalInput
  ) {
    const creator = await User.findOne({ email: creatorEmail });
    if (!creator) {
      throw new AppError('Creator account not found', 404);
    }

    const raisedCredits = creator.raisedCredits || 0;

    if (raisedCredits < 200) {
      throw new AppError(
        `Insufficient credit threshold. Minimum withdrawal requirement is 200 raised credits ($10). You currently have ${raisedCredits} raised credits.`,
        400
      );
    }

    if (input.withdrawalCredit > raisedCredits) {
      throw new AppError(
        `Withdrawal credit (${input.withdrawalCredit}) cannot exceed your total raised credits balance (${raisedCredits}).`,
        400
      );
    }

    // Business Math: 20 Credits = $1 Dollar
    const withdrawalAmount = Number((input.withdrawalCredit / 20).toFixed(2));

    const withdrawal = await Withdrawal.create({
      creatorEmail,
      creatorName,
      withdrawalCredit: input.withdrawalCredit,
      withdrawalAmount,
      paymentSystem: input.paymentSystem,
      accountNumber: input.accountNumber,
      status: 'pending',
    });

    // Send notification to Admin email or system admin
    await Notification.create({
      message: `Creator ${creatorName} requested withdrawal of ${input.withdrawalCredit} credits ($${withdrawalAmount}) via ${input.paymentSystem}`,
      toEmail: 'admin@fundnova.com',
      actionRoute: '/dashboard/admin/withdrawals',
    });

    return withdrawal;
  }

  static async getCreatorWithdrawals(creatorEmail: string) {
    const history = await Withdrawal.find({ creatorEmail }).sort({ createdAt: -1 });
    return history;
  }
}
