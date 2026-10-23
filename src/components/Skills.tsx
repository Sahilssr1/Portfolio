import { Braces, Database, LayoutGrid, Server, Wrench } from "lucide-react";
import { skillCategories } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const CATEGORY_ICONS = [Braces, LayoutGrid, Server, Database, Wrench];

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 border-y border-border bg-surface/50 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Skills"
          title="Technical Skills"
          description="The stack I use to design, build, and ship production software — grouped by discipline."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, i) => {
            const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length];
            return (
              <Reveal key={category.title} delay={i * 0.06} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/50">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-lg font-bold text-foreground">{category.title}</h3>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent/60 hover:text-foreground"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
