import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentDocument extends Document {
  transactionId: string;
  userEmail: string;
  userName: string;
  amount: number;
  credits: number;
  paymentMethod: string;
  status: 'succeeded' | 'pending' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPaymentDocument>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: 'Stripe',
    },
    status: {
      type: String,
      enum: ['succeeded', 'pending', 'failed'],
      default: 'succeeded',
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model<IPaymentDocument>('Payment', paymentSchema);
