import mongoose, { Schema, Document } from 'mongoose';

export type CampaignStatus = 'active' | 'funded' | 'closed' | 'pending' | 'approved' | 'rejected' | 'completed';

export interface ICampaign {
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  creator: mongoose.Types.ObjectId;
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
  creatorId?: mongoose.Types.ObjectId;
  creatorName?: string;
  creatorEmail?: string;
  imageUrl?: string;
}

export interface ICampaignDocument extends Document {
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  creator: mongoose.Types.ObjectId;
  status: CampaignStatus;
  deadline: Date;
  category: string;
  coverImage: string;
  createdAt: Date;
  updatedAt: Date;

  // Compatibility fields
  story: string;
  fundingGoal: number;
  amountRaised: number;
  minimumContribution: number;
  creatorId: mongoose.Types.ObjectId;
  creatorName: string;
  creatorEmail: string;
  imageUrl: string;
}

const campaignSchema = new Schema<ICampaignDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    goalAmount: {
      type: Number,
      required: [true, 'Goal amount is required'],
      min: [0.01, 'Goal amount must be greater than 0'],
    },
    raisedAmount: {
      type: Number,
      default: 0,
      min: [0, 'Raised amount cannot be negative'],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'funded', 'closed', 'pending', 'approved', 'rejected', 'completed'],
      default: 'active',
      index: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
      trim: true,
    },
    // Optional compatibility attributes
    creatorName: { type: String, default: '' },
    creatorEmail: { type: String, default: '' },
    minimumContribution: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual properties for legacy/compatibility aliases
campaignSchema.virtual('story').get(function (this: ICampaignDocument) {
  return this.description;
}).set(function (this: ICampaignDocument, val: string) {
  this.description = val;
});

campaignSchema.virtual('fundingGoal').get(function (this: ICampaignDocument) {
  return this.goalAmount;
}).set(function (this: ICampaignDocument, val: number) {
  this.goalAmount = val;
});

campaignSchema.virtual('amountRaised').get(function (this: ICampaignDocument) {
  return this.raisedAmount;
}).set(function (this: ICampaignDocument, val: number) {
  this.raisedAmount = val;
});

campaignSchema.virtual('imageUrl').get(function (this: ICampaignDocument) {
  return this.coverImage;
}).set(function (this: ICampaignDocument, val: string) {
  this.coverImage = val;
});

campaignSchema.virtual('creatorId').get(function (this: ICampaignDocument) {
  return this.creator;
});

// Indexes for query performance
campaignSchema.index({ status: 1, raisedAmount: -1 });
campaignSchema.index({ category: 1, status: 1 });

export const Campaign = mongoose.model<ICampaignDocument>('Campaign', campaignSchema);
