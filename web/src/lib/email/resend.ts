import { Resend } from "resend";

export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export type SendEmailResult = { ok: true } | { ok: false; error: string };

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

function getFromAddress(): string {
  return (
    process.env.EMAIL_FROM ?? "Placidchills <onboarding@resend.dev>"
  );
}

export async function sendEmail(
  params: SendEmailParams,
): Promise<SendEmailResult> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not configured — skipping send");
    return { ok: false, error: "Email not configured" };
  }

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (error) {
    console.error("[email]", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
