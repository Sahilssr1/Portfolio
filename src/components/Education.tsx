import { GraduationCap } from "lucide-react";
import { education } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Education() {
  return (
    <section id="education" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="Education" title="Education" />
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((item, i) => (
            <Reveal key={item.degree} delay={i * 0.08} className="h-full">
              <article className="flex h-full gap-5 rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/50">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <GraduationCap className="h-6 w-6" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg leading-snug font-bold text-foreground">{item.degree}</h3>
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[15px] text-muted">{item.institution}</p>
                  <p className="mt-1 font-mono text-[13px] text-muted">{item.period}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
