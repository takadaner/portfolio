import { NextResponse } from "next/server";
import {
  buildContactEmail,
  buildContactMailto,
  readBoundedJson,
  validateContactPayload,
} from "@/lib/contact";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 16_000;
const MAX_TRACKED_IPS = 10_000;
const CLEANUP_EVERY = 64;
// Secondary per-instance guard only; production traffic also needs a platform WAF rule.
const requestsByIp = new Map<string, number[]>();
let rateLimitChecks = 0;

function response(body: object, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function isRateLimited(request: Request): boolean {
  const forwarded = (
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip")
  )?.split(",")[0]?.trim();
  const ip = forwarded || "unknown";
  const now = Date.now();

  rateLimitChecks += 1;
  if (rateLimitChecks % CLEANUP_EVERY === 0) {
    for (const [key, timestamps] of requestsByIp) {
      const fresh = timestamps.filter((time) => now - time < WINDOW_MS);
      if (fresh.length === 0) requestsByIp.delete(key);
      else requestsByIp.set(key, fresh);
    }
  }

  const recent = (requestsByIp.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return true;
  if (!requestsByIp.has(ip) && requestsByIp.size >= MAX_TRACKED_IPS) {
    const oldest = requestsByIp.keys().next().value;
    if (oldest !== undefined) requestsByIp.delete(oldest);
  }
  recent.push(now);
  requestsByIp.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return response({ error: "Request not allowed" }, 403);
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    return response({ error: "JSON body required" }, 415);
  }
  if (isRateLimited(request)) return response({ error: "Too many requests" }, 429);

  const parsed = await readBoundedJson(request, MAX_BODY_BYTES);
  if (!parsed.ok) {
    return parsed.reason === "too_large"
      ? response({ error: "Request too large" }, 413)
      : response({ error: "Invalid request" }, 400);
  }

  const result = validateContactPayload(parsed.value);
  if (!result.ok) return response({ error: result.error }, 400);
  if (result.bot) return response({ success: true }, 200);

  const recipient = process.env.CONTACT_TO_EMAIL || "abduladaner70@gmail.com";
  const fallback = buildContactMailto(result.data, recipient);
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !sender) {
    return response({ error: "Email delivery is not configured", fallback }, 503);
  }

  const email = buildContactEmail(result.data);
  try {
    const providerResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        subject: email.subject,
        text: email.text,
        html: email.html,
        reply_to: email.replyTo,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!providerResponse.ok) {
      console.error("Contact email provider rejected the request", providerResponse.status);
      return response({ error: "Message could not be sent", fallback }, 502);
    }
  } catch (error) {
    console.error("Contact email delivery failed", error instanceof Error ? error.name : "unknown");
    return response({ error: "Message could not be sent", fallback }, 502);
  }

  return response({ success: true }, 200);
}
