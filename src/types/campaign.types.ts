import mongoose from 'mongoose';

export type CampaignCategory = 'Technology' | 'Art' | 'Community' | 'Health' | 'Education' | 'Environment';
export type CampaignStatus = 'active' | 'funded' | 'closed' | 'pending' | 'approved' | 'rejected' | 'completed';

export interface ICampaign {
  _id?: string | mongoose.Types.ObjectId;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  creator: mongoose.Types.ObjectId | string;
  status: CampaignStatus;
  deadline: Date;
  category: string;
  coverImage: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Compatibility fields
  story?: string;
  fundingGoal?: number;
  amountRaised?: number;
  minimumContribution?: number;
  creatorId?: mongoose.Types.ObjectId | string;
  creatorName?: string;
  creatorEmail?: string;
  imageUrl?: string;
}
