export type CampaignCategory = 'Technology' | 'Art' | 'Community' | 'Health' | 'Education' | 'Environment';
export type CampaignStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface ICampaign {
  _id?: string;
  title: string;
  story: string;
  category: CampaignCategory;
  fundingGoal: number;
  minimumContribution: number;
  deadline: Date;
  rewardInfo: string;
  imageUrl: string;
  amountRaised: number;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  status: CampaignStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
