import { Router, Request, Response, NextFunction } from 'express';
import { upload } from '../middleware/upload.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import { AppError } from '../errors/app-error.js';

const router = Router();

router.post(
  '/',
  protect,
  upload.single('image'),
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.file) {
        throw new AppError('No image file uploaded', 400);
      }

      // If uploaded to Cloudinary, req.file.path is the absolute HTTPS URL. Otherwise fallback to relative /uploads/
      const fileUrl = (req.file as any).path || `/uploads/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: fileUrl,
          filename: req.file.filename || (req.file as any).originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
        url: fileUrl,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
