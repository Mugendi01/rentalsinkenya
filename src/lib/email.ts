/**
 * Transactional Email Service for Rentals Kenya
 * Supports Resend API via EMAIL_API_KEY / RESEND_API_KEY with safe local development fallback.
 * Sender: Rentals Kenya <support@rentals.ke>
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Rentals Kenya';
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM || 'support@rentals.ke';
const EMAIL_API_KEY = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY || '';

export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const from = `${EMAIL_FROM_NAME} <${EMAIL_FROM_ADDRESS}>`;

  // Production dispatch if API key is configured
  if (EMAIL_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${EMAIL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to,
          subject,
          html,
          text: text || html.replace(/<[^>]*>?/gm, ''),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('[EMAIL ERROR]', data);
        return { success: false, error: data.message || 'Failed to dispatch email' };
      }
      return { success: true, messageId: data.id };
    } catch (err: any) {
      console.error('[EMAIL EXCEPTION]', err);
      return { success: false, error: err.message };
    }
  }

  // Safe local development simulation & console audit
  console.log('\n==================================================');
  console.log(`[RENTALS KENYA EMAIL DISPATCH]`);
  console.log(`From:    ${from}`);
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Time:    ${new Date().toISOString()}`);
  console.log('--------------------------------------------------');
  console.log(text || html.replace(/<[^>]*>?/gm, '').trim());
  console.log('==================================================\n');

  return { success: true, messageId: `dev-sim-${Date.now()}` };
}

/**
 * 1. Email Verification Code (6-digit, 10 min expiration)
 */
export async function sendVerificationEmail(email: string, name: string, code: string) {
  const subject = 'Welcome to Rentals Kenya — Verify Your Email';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0; font-size: 22px;">Rentals Kenya</h2>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Kenya's Marketplace for Ready-to-Run Airbnb Setups</p>
      </div>

      <p style="color: #334155; font-size: 15px; line-height: 1.5;">Hello ${name || 'there'},</p>
      <p style="color: #334155; font-size: 15px; line-height: 1.5;">Thank you for registering on Rentals Kenya. To complete your account registration and start enquiring on verified Airbnb setups, please enter the following 6-digit verification code:</p>
      
      <div style="margin: 28px 0; text-align: center;">
        <div style="display: inline-block; padding: 14px 28px; background-color: #f0f9ff; border: 2px dashed #0284c7; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0369a1;">
          ${code}
        </div>
      </div>

      <p style="color: #64748b; font-size: 13px;">This verification code will expire in <strong>10 minutes</strong>. If you did not request this registration, you can safely ignore this email.</p>
      
      <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
        &copy; ${new Date().getFullYear()} Rentals Kenya. All rights reserved.
      </div>
    </div>
  `;

  const text = `Welcome to Rentals Kenya!\n\nYour Rentals Kenya verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nEnter this code on the verification screen to activate your account.`;

  return sendEmail({ to: email, subject, html, text });
}

/**
 * 2. Account Verified Welcome
 */
export async function sendAccountVerifiedEmail(email: string, name: string) {
  const subject = 'Your Rentals Kenya account has been verified.';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0;">Rentals Kenya</h2>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Account Verified</p>
      </div>
      <p style="color: #334155; font-size: 15px;">Hello ${name || 'there'},</p>
      <p style="color: #334155; font-size: 15px; line-height: 1.5;">Your Rentals Kenya account has been verified successfully. You can now:</p>
      <ul style="color: #334155; font-size: 14px; line-height: 1.8;">
        <li>Submit direct enquiries on ready-to-run Airbnb setups</li>
        <li>Schedule verified private property viewings</li>
        <li>Track your enquiry responses and takeover progress in your personal dashboard</li>
      </ul>
      <p style="margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/properties" style="display: inline-block; background-color: #0284c7; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Browse Available Airbnb Setups</a>
      </p>
      <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
        &copy; ${new Date().getFullYear()} Rentals Kenya.
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * 3. Password Reset
 */
export async function sendPasswordResetEmail(email: string, name: string, resetLink: string, token: string) {
  const subject = 'Reset your Rentals Kenya password';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request</h2>
      <p style="color: #334155; font-size: 15px;">Hello ${name || 'there'},</p>
      <p style="color: #334155; font-size: 15px; line-height: 1.5;">We received a request to reset the password for your Rentals Kenya account. Click the button below to choose a new password:</p>
      
      <div style="margin: 24px 0; text-align: center;">
        <a href="${resetLink}" style="display: inline-block; background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px;">Reset Password</a>
      </div>

      <p style="color: #64748b; font-size: 13px;">This reset link expires in <strong>30 minutes</strong> and can only be used once.</p>
      <p style="color: #64748b; font-size: 12px;">Or paste this URL into your browser:<br/><a href="${resetLink}" style="color: #0284c7;">${resetLink}</a></p>
      
      <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
        If you didn't request a password reset, you can safely ignore this email.
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * 4. Buyer Enquiry Confirmation
 */
export async function sendBuyerEnquiryConfirmation(email: string, name: string, propertyTitle: string) {
  const subject = 'Your enquiry has been received.';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-top: 0;">Enquiry Received</h2>
      <p style="color: #334155; font-size: 15px;">Hello ${name},</p>
      <p style="color: #334155; font-size: 15px; line-height: 1.5;">Thank you for enquiring about <strong>${propertyTitle || 'an Airbnb Setup'}</strong> on Rentals Kenya.</p>
      <p style="color: #334155; font-size: 15px; line-height: 1.5;">Our investment advisory team has received your enquiry. We will review the asset inventory and tenancy details, and contact you via your preferred communication channel shortly.</p>
      
      <div style="margin: 20px 0; padding: 14px; background-color: #f8fafc; border-left: 4px solid #0284c7; border-radius: 6px;">
        <p style="margin: 0; color: #475569; font-size: 13px;">
          You can track this enquiry and view status updates anytime from your <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="color: #0284c7; font-weight: bold;">User Dashboard</a>.
        </p>
      </div>

      <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
        &copy; ${new Date().getFullYear()} Rentals Kenya. All rights reserved.
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * 5. Admin New Enquiry Notification
 */
export async function sendAdminEnquiryNotification({
  buyerName,
  buyerEmail,
  buyerPhone,
  propertyTitle,
  message,
  date,
}: {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  propertyTitle: string;
  message: string;
  date: string;
}) {
  const adminEmail = process.env.NEXT_PUBLIC_DEFAULT_EMAIL || 'info@rentals.ke';
  const subject = `New Airbnb Enquiry - ${buyerName} (${propertyTitle || 'General Enquiry'})`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #0284c7; padding-bottom: 8px;">New Airbnb Enquiry</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Buyer Name:</strong></td><td style="color: #0f172a; font-weight: bold;">${buyerName}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Property:</strong></td><td style="color: #0f172a;">${propertyTitle || 'General Enquiry'}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td><td style="color: #0f172a;">${buyerPhone}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td style="color: #0f172a;"><a href="mailto:${buyerEmail}">${buyerEmail}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;"><strong>Date:</strong></td><td style="color: #0f172a;">${date}</td></tr>
      </table>

      <div style="margin-top: 16px; padding: 14px; background-color: #f1f5f9; border-radius: 8px;">
        <strong style="color: #334155; display: block; margin-bottom: 6px;">Buyer Message:</strong>
        <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.5;">${message}</p>
      </div>

      <div style="margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/enquiries" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px;">Manage in Admin CRM &rarr;</a>
      </div>
    </div>
  `;

  return sendEmail({ to: adminEmail, subject, html });
}
