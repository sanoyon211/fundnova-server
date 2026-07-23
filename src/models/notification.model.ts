import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationDocument extends Document {
  message: string;
  toEmail: string;
  actionRoute: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotificationDocument>(
  {
    message: {
      type: String,
      required: true,
    },
    toEmail: {
      type: String,
      required: true,
      index: true,
    },
    actionRoute: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for notification popup queries sorted descending by toEmail and time
notificationSchema.index({ toEmail: 1, createdAt: -1 });

export const Notification = mongoose.model<INotificationDocument>('Notification', notificationSchema);
