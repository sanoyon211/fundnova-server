import { Notification } from '../models/notification.model.js';
import { AppError } from '../errors/app-error.js';

export class NotificationService {
  /**
   * Get all notifications for a specific user, sorted by newest first
   */
  static async getUserNotifications(toEmail: string) {
    const notifications = await Notification.find({ toEmail })
      .sort({ createdAt: -1 })
      .limit(30);
    return notifications;
  }

  /**
   * Mark a specific notification as read
   */
  static async markAsRead(notificationId: string, userEmail: string) {
    const notification = await Notification.findOne({
      _id: notificationId,
      toEmail: userEmail,
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    notification.isRead = true;
    await notification.save();
    return notification;
  }

  /**
   * Create a new notification
   */
  static async createNotification(message: string, toEmail: string, actionRoute: string = '/dashboard') {
    return await Notification.create({
      message,
      toEmail,
      actionRoute,
      isRead: false,
    });
  }
}