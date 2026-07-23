export type ContributionStatus = 'pending' | 'approved' | 'rejected';

export interface IContribution {
  _id?: string;
  campaignId: string;
  campaignTitle: string;
  contributionAmount: number;
  supporterEmail: string;
  supporterName: string;
  creatorEmail: string;
  creatorName: string;
  status: ContributionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
