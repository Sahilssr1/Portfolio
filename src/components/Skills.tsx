import { Braces, Database, LayoutGrid, Server, Wrench } from "lucide-react";
import { skillCategories } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const CATEGORY_ICONS = [Braces, LayoutGrid, Server, Database, Wrench];
const CATEGORY_STYLES = [
  { chip: "bg-pop-violet", shadow: "shadow-[6px_6px_0_#7b61ff]" },
  { chip: "bg-pop-pink", shadow: "shadow-[6px_6px_0_#ff5cab]" },
  { chip: "bg-pop-yellow", shadow: "shadow-[6px_6px_0_#ffd02e]" },
  { chip: "bg-pop-mint", shadow: "shadow-[6px_6px_0_#31d0aa]" },
  { chip: "bg-pop-sky", shadow: "shadow-[6px_6px_0_#53b7e8]" },
];

export default function Skills() {
  return (
    <section id="skills" className="dots-light scroll-mt-24 bg-ink py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Skills"
          title="My Superpowers"
          description="The stack I use to design, build, and ship production software — grouped by discipline."
          accentClass="bg-pop-pink"
          tone="cream"
        />
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, i) => {
            const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length];
            const style = CATEGORY_STYLES[i % CATEGORY_STYLES.length];
            return (
              <Reveal key={category.title} delay={i * 0.06} className="h-full">
                <div
                  className={`h-full rounded-3xl border-[3px] border-cream bg-[#1d1d1d] p-6 transition-transform duration-200 hover:-translate-y-1.5 ${style.shadow}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border-[2.5px] border-ink text-ink ${style.chip}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-cream">{category.title}</h3>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <li
                        key={skill}
                        className="cursor-default rounded-full border-2 border-cream/25 px-3 py-1.5 text-sm font-medium text-cream/85 transition-colors hover:border-cream hover:bg-cream hover:text-ink"
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
