import mongoose, { Schema, Document } from 'mongoose';
import { CampaignCategory, CampaignStatus } from '../types/campaign.types.js';

export interface ICampaignDocument extends Document {
  title: string;
  story: string;
  category: CampaignCategory;
  fundingGoal: number;
  minimumContribution: number;
  deadline: Date;
  rewardInfo: string;
  imageUrl: string;
  amountRaised: number;
  creatorId: mongoose.Types.ObjectId;
  creatorName: string;
  creatorEmail: string;
  status: CampaignStatus;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaignDocument>(
  {
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
    },
    story: {
      type: String,
      required: [true, 'Campaign story description is required'],
    },
    category: {
      type: String,
      enum: ['Technology', 'Art', 'Community', 'Health', 'Education', 'Environment'],
      required: [true, 'Category is required'],
      index: true,
    },
    fundingGoal: {
      type: Number,
      required: [true, 'Funding goal credits is required'],
      min: [1, 'Funding goal must be at least 1 credit'],
    },
    minimumContribution: {
      type: Number,
      required: [true, 'Minimum contribution amount is required'],
      min: [1, 'Minimum contribution must be at least 1 credit'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline date is required'],
      index: true,
    },
    rewardInfo: {
      type: String,
      required: [true, 'Reward info is required'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Cover image URL is required'],
    },
    amountRaised: {
      type: Number,
      default: 0,
      index: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    creatorEmail: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for top funded campaigns query optimization
campaignSchema.index({ status: 1, amountRaised: -1 });

export const Campaign = mongoose.model<ICampaignDocument>('Campaign', campaignSchema);
