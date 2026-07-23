import { Request, Response, NextFunction } from 'express';
import { WithdrawalService } from '../services/withdrawal.service.js';
import { createWithdrawalSchema } from '../validators/withdrawal.validator.js';

export class WithdrawalController {
  static async createWithdrawalRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createWithdrawalSchema.parse(req.body);
      const user = req.user!;
      const result = await WithdrawalService.createWithdrawalRequest(
        user.email,
        user.name,
        validatedData
      );

      res.status(201).json({
        success: true,
        message: 'Withdrawal request submitted successfully and is pending admin processing',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCreatorWithdrawals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const history = await WithdrawalService.getCreatorWithdrawals(req.user!.email);

      res.status(200).json({
        success: true,
        message: 'Creator withdrawal history fetched successfully',
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
}
