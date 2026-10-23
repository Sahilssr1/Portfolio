"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Dumbbell, ExternalLink, Github, Mic, Play, Trophy, Users, X } from "lucide-react";
import { projects, type Project } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const PROJECT_ART: Record<string, { band: string; chip: string; Icon: typeof Dumbbell }> = {
  atheleos: { band: "bg-pop-violet", chip: "bg-pop-violet", Icon: Dumbbell },
  hrms: { band: "bg-pop-mint", chip: "bg-pop-mint", Icon: Users },
  "ai-voice": { band: "bg-pop-pink", chip: "bg-pop-pink", Icon: Mic },
};

function LinkIcon({ kind }: { kind: Project["links"][number]["kind"] }) {
  if (kind === "repo") return <Github className="h-4 w-4" />;
  if (kind === "store") return <Play className="h-4 w-4" />;
  return <ExternalLink className="h-4 w-4" />;
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, close]);

  return (
    <section id="projects" className="dots-dark scroll-mt-24 bg-pop-yellow py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Projects"
          title="Stuff I've Built"
          description="Real products, built end to end — a live social platform, a production HR system, and an open-source AI voice platform."
          accentClass="bg-paper"
        />
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, i) => {
            const art = PROJECT_ART[project.id] ?? PROJECT_ART.atheleos;
            const ArtIcon = art.Icon;
            return (
              <Reveal key={project.id} delay={i * 0.08} className="h-full">
                <article
                  className={`pop group flex h-full flex-col overflow-hidden rounded-3xl bg-paper transition-transform duration-200 hover:-translate-y-2 ${
                    i % 2 === 0 ? "hover:-rotate-1" : "hover:rotate-1"
                  }`}
                >
                  {/* solid color cover band */}
                  <div className={`dots-light relative h-32 shrink-0 border-b-[3px] border-ink ${art.band}`}>
                    <span
                      className="font-display absolute -bottom-4 left-4 text-[84px] leading-none text-cream/25 select-none"
                      aria-hidden="true"
                    >
                      0{i + 1}
                    </span>
                    <ArtIcon
                      className="absolute right-4 bottom-3 h-14 w-14 text-cream/40 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                      aria-hidden="true"
                    />
                    <span className="pop-sm font-label absolute top-4 right-4 rounded-full bg-paper px-3 py-1 text-[11px] tracking-[0.08em] text-ink uppercase">
                      {project.status}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-[21px] text-ink uppercase">{project.name}</h3>
                    <p className="font-label mt-1.5 text-[13px] tracking-[0.1em] text-ink/55 uppercase">
                      {project.tagline}
                    </p>
                    <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed font-medium text-ink/70">
                      {project.description}
                    </p>
                    {project.highlight ? (
                      <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ink">
                        <span className={`pop-sm flex h-7 w-7 items-center justify-center rounded-lg ${art.chip}`}>
                          <Trophy className="h-4 w-4 text-ink" />
                        </span>
                        {project.highlight}
                      </p>
                    ) : null}
                    <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${project.name} technologies`}>
                      {project.technologies.slice(0, 6).map((tech) => (
                        <li
                          key={tech}
                          className="rounded-lg border-2 border-ink bg-cream px-2 py-1 font-mono text-[11px] font-semibold text-ink"
                        >
                          {tech}
                        </li>
                      ))}
                      {project.technologies.length > 6 ? (
                        <li className="rounded-lg border-2 border-ink bg-cream px-2 py-1 font-mono text-[11px] font-semibold text-ink">
                          +{project.technologies.length - 6}
                        </li>
                      ) : null}
                    </ul>
                    <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-6">
                      <button
                        type="button"
                        onClick={() => setSelected(project)}
                        className="pop-sm pop-hover pop-press font-label rounded-full bg-ink px-4.5 py-2 text-sm tracking-[0.08em] text-cream uppercase"
                        aria-haspopup="dialog"
                      >
                        View Details
                      </button>
                      {project.links.slice(0, 2).map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="pop-sm pop-hover pop-press font-label inline-flex items-center gap-1.5 rounded-full bg-paper px-4 py-2 text-sm tracking-[0.06em] text-ink uppercase"
                        >
                          <LinkIcon kind={link.kind} />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/70 p-0 sm:items-center sm:p-6"
            onClick={close}
            role="presentation"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${selected.name} — project details`}
              initial={{ opacity: 0, y: 40, scale: 0.96, rotate: -1 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="pop-lg max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-[26px] bg-cream p-6 sm:rounded-[26px] sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-ink uppercase">{selected.name}</h3>
                  <p className="font-label mt-1.5 text-[13px] tracking-[0.1em] text-ink/55 uppercase">
                    {selected.tagline}
                  </p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close project details"
                  className="pop-sm pop-hover inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pop-pink text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <span className="pop-sm font-label mt-4 inline-block rounded-full bg-pop-mint px-3 py-1 text-xs tracking-[0.08em] text-ink uppercase">
                {selected.status}
              </span>
              <p className="mt-4 text-[15px] leading-relaxed font-medium text-ink/75">{selected.description}</p>
              {selected.highlight ? (
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ink">
                  <Trophy className="h-4 w-4" />
                  {selected.highlight}
                </p>
              ) : null}
              <h4 className="font-label mt-6 text-sm tracking-[0.14em] text-ink uppercase">★ Key features</h4>
              <ul className="mt-3 space-y-2">
                {selected.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-[15px] leading-relaxed font-medium text-ink/75">
                    <span className="pop-sm mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-pop-yellow">
                      <Check className="h-3.5 w-3.5 text-ink" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <h4 className="font-label mt-6 text-sm tracking-[0.14em] text-ink uppercase">★ Technologies</h4>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {selected.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-lg border-2 border-ink bg-paper px-2.5 py-1 font-mono text-xs font-semibold text-ink"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {selected.links.map((link, li) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      li === 0
                        ? "pop-sm pop-hover pop-press font-label inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm tracking-[0.06em] text-cream uppercase"
                        : "pop-sm pop-hover pop-press font-label inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm tracking-[0.06em] text-ink uppercase"
                    }
                  >
                    <LinkIcon kind={link.kind} />
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
