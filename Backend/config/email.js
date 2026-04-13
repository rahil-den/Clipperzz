import nodemailer from "nodemailer";

/**
 * Nodemailer transporter — Gmail, port 465 (SSL), with optional proxy.
 * Set EMAIL_USER and EMAIL_PASS (16-char App Password) in your .env file.
 */
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ─── Helper ───────────────────────────────────────────────────────────────────

const sendMail = (mailOptions) =>
    new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error", error);
                reject(error);
            } else {
                console.log(`[email] Sent to ${mailOptions.to}:`, info.response);
                resolve(info);
            }
        });
    });

// ─── 1. Verification Email (sent on Register) ─────────────────────────────────

/**
 * Asks the user to verify their email address.
 * Called right after a new user registers.
 *
 * @param {string} toEmail  - recipient email
 * @param {string} toName   - full name
 * @param {string} rawToken - plain verification token
 */
export const sendVerificationEmail = async (toEmail, toName, rawToken) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyLink = `${frontendUrl}/verify-email?token=${rawToken}&email=${encodeURIComponent(toEmail)}`;
    const firstName = toName.split(" ")[0];

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Verify your Clipperz account",
        text: `Hello ${firstName},\n\nPlease verify your email by clicking the link below:\n${verifyLink}\n\nThis link expires in 24 hours.\n\n— The Clipperz Team`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#111827,#1f2937);padding:32px 40px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:#10b981;border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                <span style="color:#fff;font-size:18px;line-height:36px;">⚡</span>
              </td>
              <td style="padding-left:10px;color:#fff;font-size:18px;font-weight:700;vertical-align:middle;">Clipperz</td>
            </tr></table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 24px;">
            <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">Verify your email ✉️</h1>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.7;">
              Hi ${firstName},<br/><br/>
              Thanks for signing up! Click the button below to verify your email address and activate your Clipperz account.
            </p>

            <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
              <tr>
                <td style="background:#10b981;border-radius:50px;">
                  <a href="${verifyLink}"
                     style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#fff;text-decoration:none;border-radius:50px;">
                    Verify My Email &rarr;
                  </a>
                </td>
              </tr>
            </table>

            <p style="font-size:13px;color:#9ca3af;margin:0 0 8px;">
              This link expires in <strong>24 hours</strong>. If you didn't sign up, you can safely ignore this email.
            </p>
            <p style="font-size:12px;color:#d1d5db;word-break:break-all;margin:0;">
              Or copy this URL: <a href="${verifyLink}" style="color:#10b981;">${verifyLink}</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
              &copy; ${new Date().getFullYear()} Clipperz. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`.trim(),
    };

    await sendMail(mailOptions);
};

// ─── 2. Welcome Email (sent after email is verified / first login) ─────────────

/**
 * Celebrates the user's account being fully activated.
 * Called inside the verifyEmail controller after the token is validated.
 *
 * @param {string} toEmail - recipient email
 * @param {string} toName  - full name
 */
export const sendWelcomeEmail = async (toEmail, toName) => {
    const firstName = toName.split(" ")[0];
    const dashboardLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Welcome to Clipperz! 🎉",
        text: `Hello ${firstName},\n\nWelcome here! Your account is now fully verified.\n\nStart creating amazing clips: ${dashboardLink}\n\n— The Clipperz Team`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#111827,#1f2937);padding:32px 40px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:#10b981;border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                <span style="color:#fff;font-size:18px;line-height:36px;">⚡</span>
              </td>
              <td style="padding-left:10px;color:#fff;font-size:18px;font-weight:700;vertical-align:middle;">Clipperz</td>
            </tr></table>
          </td>
        </tr>

        <!-- Celebration Banner -->
        <tr>
          <td style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);padding:32px 40px;text-align:center;">
            <p style="font-size:48px;margin:0 0 8px;">🎉</p>
            <h1 style="margin:0;font-size:26px;font-weight:800;color:#065f46;">You're in!</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px 24px;">
            <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">
              Hello ${firstName}, Welcome here! 👋
            </h2>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.7;">
              Your email has been verified and your Clipperz account is now fully activated.
              You're all set to start creating viral short clips from your long videos using AI.
            </p>

            <!-- Feature Highlights -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td style="background:#f9fafb;border-radius:12px;padding:20px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="8">
                    <tr>
                      <td style="padding:6px 0;font-size:14px;color:#374151;">⚡ &nbsp;AI-powered clip generation</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-size:14px;color:#374151;">🎬 &nbsp;Upload any long-form video</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-size:14px;color:#374151;">📤 &nbsp;Export clips in seconds</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
              <tr>
                <td style="background:#10b981;border-radius:50px;">
                  <a href="${dashboardLink}"
                     style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#fff;text-decoration:none;border-radius:50px;">
                    Go to Dashboard &rarr;
                  </a>
                </td>
              </tr>
            </table>

            <p style="font-size:13px;color:#9ca3af;margin:0;">
              If you have any questions, just reply to this email — we're happy to help.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
              &copy; ${new Date().getFullYear()} Clipperz. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`.trim(),
    };

    await sendMail(mailOptions);
};
