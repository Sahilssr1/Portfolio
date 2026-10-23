import { GraduationCap } from "lucide-react";
import { education } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Education() {
  return (
    <section id="education" className="dots-dark scroll-mt-24 bg-pop-mint py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="Education" title="School Days" accentClass="bg-paper" />
        <div className="grid gap-7 md:grid-cols-2">
          {education.map((item, i) => (
            <Reveal key={item.degree} delay={i * 0.08} className="h-full">
              <article
                className={`pop pop-hover flex h-full gap-5 rounded-3xl bg-cream p-6 ${
                  i % 2 === 0 ? "-rotate-[0.5deg]" : "rotate-[0.5deg]"
                }`}
              >
                <span className="pop-sm flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pop-violet text-cream">
                  <GraduationCap className="h-6 w-6" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg leading-snug font-bold text-ink">{item.degree}</h3>
                    <span
                      className={`pop-sm font-label rounded-full px-2.5 py-0.5 text-xs tracking-[0.1em] text-ink uppercase ${
                        item.status === "Pursuing" ? "bg-pop-yellow" : "bg-paper"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[15px] font-medium text-ink/70">{item.institution}</p>
                  <p className="mt-1 font-mono text-[13px] font-semibold text-ink/60">{item.period}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
