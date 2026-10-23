"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Braces,
  Database,
  Gauge,
  LayoutGrid,
  Network,
  PlugZap,
  Server,
  ShieldCheck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
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

/** Real brand icons (Simple Icons / Devicon, self-hosted in /public/icons). */
const BRAND_ICONS: Record<string, string> = {
  JavaScript: "/icons/javascript.svg",
  TypeScript: "/icons/typescript.svg",
  "C#": "/icons/csharp.svg",
  Java: "/icons/java.svg",
  "Python (basic)": "/icons/python.svg",
  Dart: "/icons/dart.svg",
  HTML5: "/icons/html5.svg",
  CSS3: "/icons/css3.svg",
  "React.js": "/icons/react.svg",
  "Next.js": "/icons/nextjs.svg",
  "Tailwind CSS": "/icons/tailwind.svg",
  "Bootstrap 5": "/icons/bootstrap.svg",
  Flutter: "/icons/flutter.svg",
  "Android Development": "/icons/android.svg",
  "Node.js": "/icons/nodejs.svg",
  Express: "/icons/express.svg",
  "ASP.NET": "/icons/dotnet.svg",
  FastAPI: "/icons/fastapi.svg",
  MySQL: "/icons/mysql.svg",
  PostgreSQL: "/icons/postgresql.svg",
  Firestore: "/icons/firebase.svg",
  Git: "/icons/git.svg",
  GitHub: "/icons/github.svg",
  Docker: "/icons/docker.svg",
  Firebase: "/icons/firebase.svg",
  Cloudflare: "/icons/cloudflare.svg",
  "Visual Studio": "/icons/visualstudio.svg",
};

/** Generic skills get a Lucide glyph instead of a brand mark. */
const FALLBACK_ICONS: Record<string, LucideIcon> = {
  SQL: Database,
  "REST APIs": PlugZap,
  WebSockets: Zap,
  "Authentication & Authorization": ShieldCheck,
  "Database Design": Network,
  "SQL Query Optimization": Gauge,
};

function SkillTile({ skill, reduce }: { skill: string; reduce: boolean }) {
  const brand = BRAND_ICONS[skill];
  const Fallback = FALLBACK_ICONS[skill];
  return (
    <motion.li
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -5, y: 14 },
        show: { opacity: 1, scale: 1, rotate: 0, y: 0 },
      }}
      transition={{ type: "spring", stiffness: 320, damping: 17 }}
      whileHover={reduce ? undefined : { y: -5, rotate: -2, scale: 1.05 }}
      className="group flex flex-col items-center gap-2 rounded-2xl border-2 border-cream/15 bg-cream/[0.04] px-2 py-3.5 text-center transition-colors hover:border-cream/50 hover:bg-cream/[0.09]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-cream shadow-[3px_3px_0_rgba(0,0,0,0.55)] transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110">
        {brand ? (
          <Image src={brand} alt="" width={24} height={24} className="h-6 w-6" unoptimized />
        ) : Fallback ? (
          <Fallback className="h-6 w-6 text-ink" aria-hidden="true" />
        ) : null}
      </span>
      <span className="text-xs leading-tight font-semibold text-cream/85">{skill}</span>
    </motion.li>
  );
}

export default function Skills() {
  const reduce = useReducedMotion();
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
                    <motion.span
                      animate={reduce ? undefined : { y: [0, -3.5, 0] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 }}
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-[2.5px] border-ink text-ink ${style.chip}`}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.span>
                    <h3 className="text-lg font-bold text-cream">{category.title}</h3>
                    <span
                      className={`font-label ml-auto shrink-0 rotate-3 rounded-full px-2.5 py-1 text-xs tracking-[0.08em] text-ink ${style.chip}`}
                      aria-label={`${category.skills.length} skills`}
                    >
                      {category.skills.length} skills
                    </span>
                  </div>
                  <motion.ul
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={{
                      show: { transition: { staggerChildren: reduce ? 0 : 0.05, delayChildren: 0.1 } },
                    }}
                    className="mt-6 grid grid-cols-3 gap-2.5"
                    aria-label={`${category.title} skills`}
                  >
                    {category.skills.map((skill) => (
                      <SkillTile key={skill} skill={skill} reduce={!!reduce} />
                    ))}
                  </motion.ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
