import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create-intent', authenticate, PaymentController.createPaymentIntent);
router.post('/confirm', authenticate, PaymentController.confirmPayment);
router.get('/history', authenticate, PaymentController.getUserPaymentHistory);

export default router;
