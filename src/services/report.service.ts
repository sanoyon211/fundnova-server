import { Report } from '../models/report.model.js';
import { Campaign } from '../models/campaign.model.js';
import { CreateReportInput } from '../validators/report.validator.js';
import { AppError } from '../errors/app-error.js';

export class ReportService {
  static async createReport(
    reporterEmail: string,
    reporterName: string,
    input: CreateReportInput
  ) {
    const campaign = await Campaign.findById(input.campaignId);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    // Check if user already reported this campaign
    const existingReport = await Report.findOne({
      campaignId: input.campaignId,
      reporterEmail,
    });

    if (existingReport) {
      throw new AppError('You have already reported this campaign', 400);
    }

    const report = await Report.create({
      campaignId: campaign._id,
      campaignTitle: campaign.title,
      reporterEmail,
      reporterName,
      reason: input.reason,
      status: 'pending',
    });

    return report;
  }

  static async getAllReports() {
    const reports = await Report.find().sort({ createdAt: -1 });
    return reports;
  }

  static async deleteReport(reportId: string) {
    const report = await Report.findById(reportId);
    if (!report) {
      throw new AppError('Report record not found', 404);
    }

    await Report.findByIdAndDelete(reportId);
    return { id: reportId, deleted: true };
  }
}
