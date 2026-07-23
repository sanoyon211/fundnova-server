import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service.js';
import { createPaymentIntentSchema, confirmPaymentSchema } from '../validators/payment.validator.js';

export class PaymentController {
  static async createPaymentIntent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createPaymentIntentSchema.parse(req.body);
      const result = await PaymentService.createPaymentIntent(validatedData);

      res.status(200).json({
        success: true,
        message: 'Stripe PaymentIntent generated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async confirmPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = confirmPaymentSchema.parse(req.body);
      const user = req.user!;
      const result = await PaymentService.confirmPaymentAndAllocateCredits(
        user.email,
        user.name,
        validatedData
      );

      res.status(200).json({
        success: true,
        message: 'Payment confirmed and credits allocated to Supporter account',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserPaymentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const history = await PaymentService.getUserPaymentHistory(req.user!.email);

      res.status(200).json({
        success: true,
        message: 'Payment history fetched successfully',
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
}
