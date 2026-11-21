import { resolveMx } from "node:dns/promises";
import { topicSubject, validateContact, type ContactErrors } from "../../lib/contact";

// Delivers contact form messages to the owner's inbox through Resend (https://resend.com/docs/api-reference/emails/send-email).
// Needs RESEND_API_KEY. CONTACT_TO / CONTACT_FROM are optional overrides; see .env.example.
const TO = process.env.CONTACT_TO || "brexcel14@gmail.com";
// resend.dev works without a verified domain, but only delivers to the Resend account's own address.
const FROM = process.env.CONTACT_FROM || "Portfolio contact <onboarding@resend.dev>";

const json = (status: number, body: object) => Response.json(body, { status });

// A well-formed address can still point at a domain that takes no mail (gmial.com, test.invalid).
// Only a definite "no such domain / no mail records" rejects; a DNS hiccup on our side lets the message through.
async function domainTakesMail(email: string) {
  const domain = email.split("@")[1];
  try {
    const mx = await Promise.race([
      resolveMx(domain),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ]);
    return mx === null || mx.length > 0;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    return !(code === "ENOTFOUND" || code === "ENODATA");
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }
  // `null`, arrays and plain values are valid JSON but not a message.
  if (!body || typeof body !== "object" || Array.isArray(body)) return json(400, { error: "Invalid request." });

  // Honeypot: people never see this field, bots fill it. Pretend it worked.
  if (typeof body.company === "string" && body.company.trim()) return json(200, { ok: true });

  const input = {
    name: String(body.name ?? "").trim(),
    email: String(body.email ?? "").trim(),
    message: String(body.message ?? "").trim(),
  };
  const errors: ContactErrors = validateContact(input);
  if (!errors.email && !(await domainTakesMail(input.email))) {
    errors.email = "That email domain can’t receive mail. Please check the address.";
  }
  if (Object.keys(errors).length) return json(400, { errors });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("contact: RESEND_API_KEY is not set");
    return json(503, { error: "The contact form isn’t set up yet. Please email me directly." });
  }

  const name = input.name.replace(/[\r\n]+/g, " ");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: input.email,
      subject: `Portfolio: ${topicSubject(body.topic)} from ${name}`,
      text: `From: ${name} <${input.email}>\n\n${input.message}`,
    }),
  });
  if (!res.ok) {
    console.error("contact: Resend refused the message", res.status, await res.text());
    return json(502, { error: "Your message couldn’t be sent right now. Please try again or email me directly." });
  }
  return json(200, { ok: true });
}
