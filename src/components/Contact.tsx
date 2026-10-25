"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Github, Linkedin, Loader2, Mail, MailWarning, Send } from "lucide-react";
import { siteConfig } from "@/data/content";
import SectionHeading from "./SectionHeading";
import GravityLetters from "./GravityLetters";
import Reveal from "./Reveal";

const formSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name (at least 2 characters).").max(80),
  email: z.email("Please enter a valid email address.").max(120),
  message: z.string().trim().min(10, "Your message should be at least 10 characters.").max(2000),
});

type FormValues = z.infer<typeof formSchema>;
type SubmitState = "idle" | "sending" | "sent" | "activation" | "failed";

const inputClasses =
  "w-full rounded-2xl border-[3px] border-ink bg-paper px-4 py-3 text-[15px] font-medium text-ink placeholder:text-ink/40 transition-shadow focus:shadow-[4px_4px_0_#141414] focus:outline-none";

const LABEL_CLASSES = "font-label mb-2 block text-sm tracking-[0.12em] text-ink uppercase";

export default function Contact() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  /**
   * Delivered by FormSubmit (no-signup form relay) straight to Sahil's inbox.
   * The endpoint was activated once via the link FormSubmit emailed to him;
   * the visitor's address is sent as the message's email field and Reply-To.
   */
  const onSubmit = async (values: FormValues) => {
    setSubmitState("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${siteConfig.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
          _subject: `Portfolio contact — ${values.name}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = (await res.json().catch(() => null)) as { success?: string; message?: string } | null;
      if (data?.success === "true") {
        setSubmitState("sent");
      } else if (data?.message && /activat/i.test(data.message)) {
        setSubmitState("activation");
      } else {
        setSubmitState("failed");
      }
    } catch {
      setSubmitState("failed");
    }
  };

  const cards = [
    {
      href: `mailto:${siteConfig.email}`,
      external: false,
      icon: Mail,
      chip: "bg-pop-yellow",
      label: "Email",
      value: siteConfig.email,
    },
    {
      href: siteConfig.linkedin,
      external: true,
      icon: Linkedin,
      chip: "bg-pop-sky",
      label: "LinkedIn",
      value: "Connect with me on LinkedIn",
    },
    {
      href: siteConfig.github,
      external: true,
      icon: Github,
      chip: "bg-pop-mint",
      label: "GitHub",
      value: "github.com/Sahilssr1",
    },
  ];

  return (
    <section id="contact" className="dots-dark scroll-mt-24 bg-pop-pink py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Let's Talk!"
          titleNode={
            <GravityLetters
              text="Let's Talk!"
              fontSize={48}
              fontWeight={400}
              fontFamily='"Archivo Black", "Arial Black", sans-serif'
              colors={["#141414", "#7b61ff"]}
              highlightWords={["Talk!"]}
              highlightColor="#7b61ff"
              grainSize={5}
              grainScale={1.6}
              collapseOnView
              style={{ height: "clamp(4.8rem,8vw,7.2rem)", width: "clamp(15rem,28vw,20rem)" }}
            />
          }
          description="I'm interested in software engineering opportunities and interesting projects. The fastest way to reach me is email — I read everything personally."
          accentClass="bg-cream"
        />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="space-y-5">
              {cards.map((card, i) => (
                <a
                  key={card.label}
                  href={card.href}
                  {...(card.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className={`pop pop-hover flex items-center gap-4 rounded-3xl bg-cream p-5 ${
                    i % 2 === 0 ? "-rotate-[0.5deg]" : "rotate-[0.5deg]"
                  }`}
                >
                  <span
                    className={`pop-sm flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-ink ${card.chip}`}
                  >
                    <card.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="font-label block text-xs tracking-[0.16em] text-ink/55 uppercase">
                      {card.label}
                    </span>
                    <span className="mt-0.5 block text-[15px] font-bold break-all text-ink">{card.value}</span>
                  </span>
                </a>
              ))}
              <div className="pop-sm font-label inline-block rotate-1 rounded-full bg-ink px-4 py-2 text-[13px] tracking-[0.12em] text-pop-yellow uppercase">
                ★ I usually reply within a day
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="pop-lg rounded-[26px] bg-cream p-6 sm:p-8"
              aria-label="Contact form"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className={LABEL_CLASSES}>
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Smith"
                    className={inputClasses}
                    {...register("name")}
                  />
                  {errors.name ? <p className="mt-1.5 text-sm font-semibold text-red-600">{errors.name.message}</p> : null}
                </div>
                <div>
                  <label htmlFor="contact-email" className={LABEL_CLASSES}>
                    Your email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@company.com"
                    className={inputClasses}
                    {...register("email")}
                  />
                  {errors.email ? (
                    <p className="mt-1.5 text-sm font-semibold text-red-600">{errors.email.message}</p>
                  ) : null}
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="contact-message" className={LABEL_CLASSES}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Tell me about the role or project you have in mind…"
                  className={`${inputClasses} resize-y`}
                  {...register("message")}
                />
                {errors.message ? (
                  <p className="mt-1.5 text-sm font-semibold text-red-600">{errors.message.message}</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={submitState === "sending" || submitState === "sent"}
                className="pop pop-hover pop-press font-label mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-base tracking-[0.08em] text-cream uppercase disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState === "sending" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitState === "sending" ? "Sending…" : submitState === "sent" ? "Message Sent" : "Send Message"}
              </button>

              {submitState === "sent" ? (
                <p
                  className="pop-sm mt-5 flex items-start gap-2 rounded-2xl bg-pop-mint px-4 py-3 text-sm font-semibold text-ink"
                  role="status"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  Thank you — your message has been sent. I&apos;ll get back to you soon.
                </p>
              ) : null}
              {submitState === "activation" ? (
                <div className="pop-sm mt-5 rounded-2xl bg-pop-yellow px-4 py-3.5 text-sm font-semibold text-ink" role="status">
                  <p className="flex items-start gap-2">
                    <MailWarning className="mt-0.5 h-4 w-4 shrink-0" />
                    The form is being activated right now — please send your message again in a minute, or email me
                    directly at{" "}
                    <a href={`mailto:${siteConfig.email}`} className="font-bold underline">
                      {siteConfig.email}
                    </a>
                    .
                  </p>
                </div>
              ) : null}
              {submitState === "failed" ? (
                <p
                  className="pop-sm mt-5 rounded-2xl bg-[#ffd9d9] px-4 py-3 text-sm font-semibold text-ink"
                  role="alert"
                >
                  Something went wrong while sending. Please email me directly at{" "}
                  <a href={`mailto:${siteConfig.email}`} className="font-bold underline">
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
