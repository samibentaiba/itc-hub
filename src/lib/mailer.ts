
// src/lib/mailer.ts
import nodemailer from "nodemailer";
import { getEmailConfig } from "./secrets";

export async function sendPasswordResetEmail(toEmail: string, resetUrl: string) {
  const cfg = await getEmailConfig();

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  });

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Inter,Arial,sans-serif">
      <h2>Password Reset</h2>
      <p>We received a request to reset your password. If you didn’t request this, you can ignore this email.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;text-decoration:none;border-radius:8px;border:1px solid #ccc">
          Reset your password
        </a>
      </p>
      <p>This link expires in 30 minutes.</p>
    </div>
  `;

  await transporter.sendMail({
    from: cfg.from,
    to: toEmail,
    subject: "Password Reset Request",
    text: `Reset your password using this link: ${resetUrl}`,
    html,
  });
}
