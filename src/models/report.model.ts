import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  campaignId: mongoose.Types.ObjectId;
  campaignTitle: string;
  reporterEmail: string;
  reporterName: string;
  reason: string;
  status: 'pending' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
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
    reporterEmail: {
      type: String,
      required: true,
      index: true,
    },
    reporterName: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model<IReport>('Report', reportSchema);
