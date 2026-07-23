import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service.js';

export class NotificationController {
  static async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userEmail = req.user?.email;
      if (!userEmail) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const notifications = await NotificationService.getUserNotifications(userEmail);

      res.status(200).json({
        success: true,
        message: 'Notifications fetched successfully',
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userEmail = req.user?.email;
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;

      if (!userEmail) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const updated = await NotificationService.markAsRead(id, userEmail);

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
