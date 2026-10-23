import { experience } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 border-y border-border bg-surface/50 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Experience"
          title="Professional Experience"
          description="One company, a clear progression — from web development intern to full-time full stack developer at Sanjivani Media and Technology."
        />
        <ol className="relative ml-2 space-y-12 border-l border-border pl-8 sm:ml-4">
          {experience.map((item, i) => (
            <Reveal key={item.role} delay={i * 0.08}>
              <li className="relative">
                <span
                  className={`absolute top-1.5 -left-[37px] h-3.5 w-3.5 rounded-full border-2 ${
                    item.current ? "border-accent bg-accent" : "border-border bg-background"
                  }`}
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <h3 className="font-display text-xl font-bold text-foreground">{item.role}</h3>
                  {item.current ? (
                    <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                      Current role
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-sm font-medium text-muted">
                  {item.company} · <span className="font-mono text-[13px]">{item.period}</span>
                </p>
                <ul className="mt-4 grid max-w-3xl gap-x-8 gap-y-2 sm:grid-cols-1">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
