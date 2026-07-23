import mongoose, { Schema, Document } from 'mongoose';
import { PaymentSystem, WithdrawalStatus } from '../types/withdrawal.types.js';

export interface IWithdrawalDocument extends Document {
  creatorEmail: string;
  creatorName: string;
  withdrawalCredit: number;
  withdrawalAmount: number;
  paymentSystem: PaymentSystem;
  accountNumber: string;
  status: WithdrawalStatus;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new Schema<IWithdrawalDocument>(
  {
    creatorEmail: {
      type: String,
      required: true,
      index: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    withdrawalCredit: {
      type: Number,
      required: [true, 'Withdrawal credit amount is required'],
      min: [200, 'Minimum withdrawal threshold is 200 credits ($10)'],
    },
    withdrawalAmount: {
      type: Number,
      required: true,
    },
    paymentSystem: {
      type: String,
      enum: ['Stripe', 'Bkash', 'Rocket', 'Nagad'],
      required: [true, 'Payment system selection is required'],
    },
    accountNumber: {
      type: String,
      required: [true, 'Account number is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Withdrawal = mongoose.model<IWithdrawalDocument>('Withdrawal', withdrawalSchema);
