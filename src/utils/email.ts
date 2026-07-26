import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || 'smtp.ethereal.email';
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER || 'mock_user';
const smtpPass = process.env.SMTP_PASS || 'mock_pass';
const fromEmail = process.env.EMAIL_FROM || '"FundNova Platform" <no-reply@fundnova.io>';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

/**
 * Send Welcome Email on user registration
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  try {
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 800; tracking-tight: -0.025em;">Welcome to FundNova!</h1>
          <p style="margin-top: 8px; font-size: 14px; opacity: 0.9;">Empowering Ideas. Inspiring Change.</p>
        </div>
        <div style="padding: 32px 24px; color: #0F172A; line-height: 1.6;">
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0;">Hi ${name},</h2>
          <p style="font-size: 14px; color: #475569;">
            Thank you for joining <strong>FundNova</strong>! Your account has been initialized successfully with starter credits to explore and back groundbreaking campaigns.
          </p>
          <div style="background: #F8FAFC; border-left: 4px solid #2563EB; padding: 16px; margin: 24px 0; border-radius: 8px;">
            <p style="margin: 0; font-size: 13px; color: #334155; font-weight: 600;">
              ✨ Tip: Explore active campaigns or start your own initiative to raise platform credits from global backers.
            </p>
          </div>
          <div style="text-align: center; margin-top: 32px;">
            <a href="http://localhost:3000/explore" style="background: #2563EB; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; display: inline-block;">Explore Campaigns</a>
          </div>
        </div>
        <div style="background: #F8FAFC; padding: 16px 24px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0;">
          &copy; ${new Date().getFullYear()} FundNova Crowdfunding Platform. All rights reserved.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Welcome to FundNova – Empowering Ideas',
      html: htmlContent,
    });
  } catch (error) {
    console.warn(`[Email Warning] Welcome email to ${email} failed:`, error);
  }
}

/**
 * Send Pledge Confirmation Email
 */
export async function sendPledgeConfirmation(
  email: string,
  amount: number,
  campaignTitle: string
): Promise<void> {
  try {
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 800;">Pledge Confirmed!</h1>
          <p style="margin-top: 8px; font-size: 14px; opacity: 0.9;">Thank you for supporting innovation.</p>
        </div>
        <div style="padding: 32px 24px; color: #0F172A; line-height: 1.6;">
          <p style="font-size: 14px; color: #475569;">
            Your pledge of <strong style="color: #2563EB; font-size: 16px;">${amount} Credits</strong> to <strong>"${campaignTitle}"</strong> was recorded successfully.
          </p>
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; padding: 16px; margin: 24px 0; border-radius: 12px; text-align: center;">
            <span style="font-size: 13px; font-weight: 700; color: #166534;">
              ✓ Full refund guarantee if campaign goal is not met or cancelled by creator.
            </span>
          </div>
          <div style="text-align: center; margin-top: 28px;">
            <a href="http://localhost:3000/dashboard/supporter/contributions" style="background: #0F172A; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 13px; display: inline-block;">View My Contributions</a>
          </div>
        </div>
        <div style="background: #F8FAFC; padding: 16px 24px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0;">
          &copy; ${new Date().getFullYear()} FundNova Crowdfunding Platform.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: `Pledge Confirmed: ${amount} Credits to "${campaignTitle}"`,
      html: htmlContent,
    });
  } catch (error) {
    console.warn(`[Email Warning] Pledge confirmation to ${email} failed:`, error);
  }
}

/**
 * Send Campaign Status Update Email (Approved / Rejected)
 */
export async function sendCampaignStatusUpdate(
  email: string,
  campaignTitle: string,
  status: string
): Promise<void> {
  try {
    const isApproved = status === 'approved' || status === 'active';
    const headerBg = isApproved
      ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
      : 'linear-gradient(135deg, #DC2626 0%, #F43F5E 100%)';

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: ${headerBg}; padding: 32px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 800;">Campaign Status Update</h1>
          <p style="margin-top: 8px; font-size: 14px; opacity: 0.9;">Moderation Review Complete</p>
        </div>
        <div style="padding: 32px 24px; color: #0F172A; line-height: 1.6;">
          <p style="font-size: 14px; color: #475569;">
            Your campaign <strong>"${campaignTitle}"</strong> has been reviewed by the platform administrators.
          </p>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 20px; margin: 24px 0; border-radius: 12px; text-align: center;">
            <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.05em; color: #64748B; display: block; margin-bottom: 4px;">New Status</span>
            <span style="font-size: 18px; font-weight: 900; color: ${isApproved ? '#059669' : '#DC2626'}; text-transform: uppercase;">
              ${status}
            </span>
          </div>
          <div style="text-align: center; margin-top: 28px;">
            <a href="http://localhost:3000/dashboard/creator/my-campaigns" style="background: #2563EB; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 13px; display: inline-block;">Manage Creator Campaigns</a>
          </div>
        </div>
        <div style="background: #F8FAFC; padding: 16px 24px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0;">
          &copy; ${new Date().getFullYear()} FundNova Crowdfunding Platform.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: `Campaign Moderation Update: "${campaignTitle}" is ${status.toUpperCase()}`,
      html: htmlContent,
    });
  } catch (error) {
    console.warn(`[Email Warning] Campaign status update to ${email} failed:`, error);
  }
}
