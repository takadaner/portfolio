export type ContactPayload = {
  interest: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  companyWebsite: string;
};

type ValidationResult =
  | { ok: true; data: ContactPayload; bot?: false }
  | { ok: true; bot: true }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type BoundedJsonResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: "too_large" | "invalid" };

export async function readBoundedJson(
  request: Request,
  maxBytes: number,
): Promise<BoundedJsonResult> {
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    const declaredLength = Number(contentLength);
    if (!Number.isFinite(declaredLength) || declaredLength < 0) {
      return { ok: false, reason: "invalid" };
    }
    if (declaredLength > maxBytes) return { ok: false, reason: "too_large" };
  }

  if (!request.body) return { ok: false, reason: "invalid" };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return { ok: false, reason: "too_large" };
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, reason: "invalid" };
  } finally {
    reader.releaseLock();
  }
}

function readText(
  value: unknown,
  field: string,
  maxLength: number,
  required = true,
): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof value !== "string") return { ok: false, error: `Invalid ${field}` };
  const normalized = value.trim();
  if (required && normalized.length === 0) {
    return { ok: false, error: `${field} is required` };
  }
  if (normalized.length > maxLength) {
    return { ok: false, error: `${field} is too long` };
  }
  return { ok: true, value: normalized };
}

export function validateContactPayload(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Invalid request" };
  }

  const payload = input as Record<string, unknown>;
  const honeypot = readText(payload.companyWebsite ?? "", "website", 300, false);
  if (!honeypot.ok) return honeypot;
  if (honeypot.value) return { ok: true, bot: true };

  const interest = readText(payload.interest, "interest", 80);
  const name = readText(payload.name, "name", 120);
  const email = readText(payload.email, "email", 254);
  const phone = readText(payload.phone ?? "", "phone", 40, false);
  const message = readText(payload.message, "message", 4000);

  if (!interest.ok) return interest;
  if (!name.ok) return name;
  if (!email.ok) return email;
  if (!phone.ok) return phone;
  if (!message.ok) return message;
  if (!EMAIL_PATTERN.test(email.value)) {
    return { ok: false, error: "Invalid email" };
  }
  if (message.value.length < 10) {
    return { ok: false, error: "Message is too short" };
  }

  return {
    ok: true,
    data: {
      interest: interest.value,
      name: name.value,
      email: email.value,
      phone: phone.value,
      message: message.value,
      companyWebsite: "",
    },
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

export function buildContactEmail(data: ContactPayload) {
  const safe = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, escapeHtml(value)]),
  ) as Record<keyof ContactPayload, string>;

  return {
    subject: `Portfolio enquiry: ${data.interest}`,
    replyTo: data.email,
    text: [
      `Interest: ${data.interest}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "Not provided"}`,
      "",
      data.message,
    ].join("\n"),
    html: `<h2>New portfolio enquiry</h2>
      <p><strong>Interest:</strong> ${safe.interest}</p>
      <p><strong>Name:</strong> ${safe.name}</p>
      <p><strong>Email:</strong> ${safe.email}</p>
      <p><strong>Phone:</strong> ${safe.phone || "Not provided"}</p>
      <p><strong>Message:</strong></p>
      <p>${safe.message.replace(/\n/g, "<br>")}</p>`,
  };
}

export function buildContactMailto(data: ContactPayload, recipient: string): string {
  const email = buildContactEmail(data);
  return `mailto:${recipient}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.text)}`;
}
