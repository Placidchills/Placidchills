export async function subscribeToMailerLite(
  email: string,
  source = "website",
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  if (!apiKey) {
    return { ok: false, error: "MailerLite not configured" };
  }

  const body: Record<string, unknown> = {
    email,
    fields: { source },
  };

  if (groupId) {
    body.groups = [groupId];
  }

  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.ok || res.status === 409) {
    return { ok: true };
  }

  const data = await res.json().catch(() => ({}));
  return {
    ok: false,
    error: (data as { message?: string }).message ?? "Subscription failed",
  };
}
