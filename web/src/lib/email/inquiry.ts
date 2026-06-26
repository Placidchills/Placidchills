import { site } from "@/config/site";
import { sendEmail } from "./resend";

export type InquiryEmailData = {
  name: string;
  email: string;
  service: string;
  message: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendInquiryConfirmation(
  data: InquiryEmailData,
): Promise<{ ok: boolean; error?: string }> {
  const html = `
    <div style="font-family: sans-serif; max-width: 560px; color: #1a1a1a;">
      <p>Hey ${escapeHtml(data.name)},</p>
      <p>Thanks for reaching out — I received your inquiry about <strong>${escapeHtml(data.service)}</strong>.</p>
      <p>I'll review your message and get back to you within 24 hours.</p>
      <p style="color: #666; font-size: 14px;">— ${site.owner}, ${site.name}</p>
    </div>
  `;

  const result = await sendEmail({
    to: data.email,
    subject: `We received your inquiry — ${site.name}`,
    html,
  });

  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function sendInquiryAdminNotification(
  data: InquiryEmailData,
): Promise<{ ok: boolean; error?: string }> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("[email] ADMIN_EMAIL not configured — skipping admin notification");
    return { ok: false, error: "Admin email not configured" };
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 560px; color: #1a1a1a;">
      <h2 style="margin: 0 0 16px;">New inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Service:</strong> ${escapeHtml(data.service)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-radius: 6px;">${escapeHtml(data.message)}</p>
    </div>
  `;

  const result = await sendEmail({
    to: adminEmail,
    subject: `[${site.name}] New inquiry — ${data.service}`,
    html,
  });

  return result.ok ? { ok: true } : { ok: false, error: result.error };
}
