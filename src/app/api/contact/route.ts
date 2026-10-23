import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(120),
  message: z.string().trim().min(10).max(2000),
});

/**
 * Contact form endpoint.
 *
 * Sending activates when ONE of these server-side transports is configured:
 *
 * Option A — SMTP (e.g. Hostinger):
 *   SMTP_HOST — e.g. smtp.hostinger.com
 *   SMTP_PORT — e.g. 465 (SSL) or 587 (STARTTLS)
 *   SMTP_USER — mailbox address used to authenticate
 *   SMTP_PASS — mailbox password
 *   SMTP_FROM — sender address (defaults to SMTP_USER; Hostinger requires
 *               the From address to be the authenticated mailbox)
 *
 * Option B — Resend:
 *   RESEND_API_KEY     — API key for Resend (https://resend.com)
 *   CONTACT_FROM_EMAIL — verified sender address in Resend
 *
 *   CONTACT_TO_EMAIL — inbox that receives messages (defaults to Sahil's email)
 *
 * SMTP is tried first when both are set. Without either transport the route
 * returns NOT_CONFIGURED and the UI offers a mailto fallback.
 * Secrets are read only on the server and never exposed to the client.
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

  const { name, email, message } = parsed.data;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "Sahilsinghrajput394@gmail.com";
  const subject = `Portfolio contact — ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;

  /* ---- Option A: SMTP via nodemailer ---- */
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpHost && smtpUser && smtpPass) {
    const smtpPort = Number(process.env.SMTP_PORT ?? "465");
    const smtpSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : smtpPort === 465;
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM ?? smtpUser,
        to: toEmail,
        replyTo: email,
        subject,
        text,
      });
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ ok: false, error: "SEND_FAILED" }, { status: 502 });
    }
  }

  /* ---- Option B: Resend ---- */
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  if (apiKey && fromEmail) {
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
          subject,
          text,
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

  return NextResponse.json({ ok: false, error: "NOT_CONFIGURED" }, { status: 503 });
}
