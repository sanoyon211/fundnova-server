import mongoose from 'mongoose';

export type PledgeStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface IPledge {
  _id?: string | mongoose.Types.ObjectId;
  campaign: mongoose.Types.ObjectId | string;
  supporter: mongoose.Types.ObjectId | string;
  amount: number;
  status: PledgeStatus;
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
