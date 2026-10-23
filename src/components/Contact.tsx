"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Github, Linkedin, Loader2, Mail, MailWarning, Send } from "lucide-react";
import { siteConfig } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const formSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name (at least 2 characters).").max(80),
  email: z.email("Please enter a valid email address.").max(120),
  message: z.string().trim().min(10, "Your message should be at least 10 characters.").max(2000),
});

type FormValues = z.infer<typeof formSchema>;
type SubmitState = "idle" | "sending" | "sent" | "not-configured" | "failed";

const inputClasses =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none";

export default function Contact() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const mailtoHref = () => {
    const { name, email, message } = getValues();
    const subject = encodeURIComponent(`Portfolio enquiry from ${name || "your website"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    return `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setSubmitState("sent");
        return;
      }
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setSubmitState(data?.error === "NOT_CONFIGURED" ? "not-configured" : "failed");
    } catch {
      setSubmitState("failed");
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Let's Build Something"
          description="I'm interested in software engineering opportunities and interesting projects. The fastest way to reach me is email — I read everything personally."
        />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="space-y-4">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/60"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Mail className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold tracking-widest text-muted uppercase">Email</span>
                  <span className="mt-0.5 block text-[15px] font-medium break-all text-foreground">{siteConfig.email}</span>
                </span>
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/60"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Linkedin className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold tracking-widest text-muted uppercase">LinkedIn</span>
                  <span className="mt-0.5 block text-[15px] font-medium text-foreground">Connect with me on LinkedIn</span>
                </span>
              </a>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/60"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Github className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold tracking-widest text-muted uppercase">GitHub</span>
                  <span className="mt-0.5 block text-[15px] font-medium text-foreground">github.com/Sahilssr1</span>
                </span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
              aria-label="Contact form"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-foreground">
                    Your name
                  </label>
                  <input id="contact-name" type="text" autoComplete="name" placeholder="Jane Smith" className={inputClasses} {...register("name")} />
                  {errors.name ? <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p> : null}
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-foreground">
                    Your email
                  </label>
                  <input id="contact-email" type="email" autoComplete="email" placeholder="jane@company.com" className={inputClasses} {...register("email")} />
                  {errors.email ? <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p> : null}
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Tell me about the role or project you have in mind…"
                  className={`${inputClasses} resize-y`}
                  {...register("message")}
                />
                {errors.message ? <p className="mt-1.5 text-sm text-red-500">{errors.message.message}</p> : null}
              </div>

              <button
                type="submit"
                disabled={submitState === "sending" || submitState === "sent"}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitState === "sending" ? "Sending…" : submitState === "sent" ? "Message Sent" : "Send Message"}
              </button>

              {submitState === "sent" ? (
                <p className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400" role="status">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  Thank you — your message has been sent. I&apos;ll get back to you soon.
                </p>
              ) : null}
              {submitState === "not-configured" ? (
                <div className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300" role="status">
                  <p className="flex items-start gap-2">
                    <MailWarning className="mt-0.5 h-4 w-4 shrink-0" />
                    The form&apos;s email service isn&apos;t configured on this deployment yet. You can still send
                    your message instantly through your email app:
                  </p>
                  <a
                    href={mailtoHref()}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    <Mail className="h-4 w-4" />
                    Open in Email App
                  </a>
                </div>
              ) : null}
              {submitState === "failed" ? (
                <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400" role="alert">
                  Something went wrong while sending. Please email me directly at{" "}
                  <a href={`mailto:${siteConfig.email}`} className="font-semibold underline">
                    {siteConfig.email}
                  </a>
                  .
                </p>
              ) : null}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
