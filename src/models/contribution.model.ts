import mongoose, { Schema, Document } from 'mongoose';
import { ContributionStatus } from '../types/contribution.types.js';

export interface IContributionDocument extends Document {
  campaignId: mongoose.Types.ObjectId;
  campaignTitle: string;
  contributionAmount: number;
  supporterEmail: string;
  supporterName: string;
  creatorEmail: string;
  creatorName: string;
  status: ContributionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const contributionSchema = new Schema<IContributionDocument>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
      index: true,
    },
    campaignTitle: {
      type: String,
      required: true,
    },
    contributionAmount: {
      type: Number,
      required: [true, 'Contribution amount is required'],
      min: [1, 'Contribution amount must be at least 1 credit'],
    },
    supporterEmail: {
      type: String,
      required: true,
      index: true,
    },
    supporterName: {
      type: String,
      required: true,
    },
    creatorEmail: {
      type: String,
      required: true,
      index: true,
    },
    creatorName: {
      type: String,
      required: true,
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

export const Contribution = mongoose.model<IContributionDocument>('Contribution', contributionSchema);
