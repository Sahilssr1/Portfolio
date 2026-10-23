import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(120),
  message: z.string().trim().min(10).max(2000),
});

/**
 * Contact form endpoint.
 * Sending activates only when these server-side env vars are set:
 *   RESEND_API_KEY     — API key for Resend (https://resend.com)
 *   CONTACT_FROM_EMAIL — verified sender address in Resend
 *   CONTACT_TO_EMAIL   — inbox that receives messages (defaults to Sahil's email)
 * Without them the route returns NOT_CONFIGURED and the UI offers a mailto fallback.
 * Keys are read only on the server and never exposed to the client.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_BODY" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "VALIDATION_FAILED" }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    return NextResponse.json({ ok: false, error: "NOT_CONFIGURED" }, { status: 503 });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL ?? "Sahilsinghrajput394@gmail.com";
  const { name, email, message } = parsed.data;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `Portfolio contact — ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "SEND_FAILED" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "SEND_FAILED" }, { status: 502 });
  }
}
