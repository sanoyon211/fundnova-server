import mongoose, { Schema, Document } from 'mongoose';

export type PledgeStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface IPledge {
  campaign: mongoose.Types.ObjectId;
  supporter: mongoose.Types.ObjectId;
  amount: number;
  status: PledgeStatus;
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPledgeDocument extends Document {
  campaign: mongoose.Types.ObjectId;
  supporter: mongoose.Types.ObjectId;
  amount: number;
  status: PledgeStatus;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const pledgeSchema = new Schema<IPledgeDocument>(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign reference is required'],
      index: true,
    },
    supporter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Supporter reference is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Pledge amount is required'],
      min: [0.01, 'Pledge amount must be greater than 0'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    transactionId: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes on campaign and supporter to optimize user and campaign pledge queries
pledgeSchema.index({ supporter: 1, createdAt: -1 });
pledgeSchema.index({ campaign: 1, createdAt: -1 });
pledgeSchema.index({ campaign: 1, status: 1 });

export const Pledge = mongoose.model<IPledgeDocument>('Pledge', pledgeSchema);
