import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service.js';
import { createReportSchema } from '../validators/report.validator.js';

export class ReportController {
  static async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedInput = createReportSchema.parse(req.body);
      const user = req.user!;

      const report = await ReportService.createReport(
        user.email,
        user.name,
        validatedInput
      );

      res.status(201).json({
        success: true,
        message: 'Campaign reported successfully. Administrator will review it.',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllReports(_req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await ReportService.getAllReports();

      res.status(200).json({
        success: true,
        message: 'Fraud reports fetched successfully',
        data: reports,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ReportService.deleteReport(id as string);

      res.status(200).json({
        success: true,
        message: 'Report deleted successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
