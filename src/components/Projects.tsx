"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Dumbbell, ExternalLink, Github, Mic, Play, Trophy, Users, X } from "lucide-react";
import { projects, type Project } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { handleSpotlightMove } from "./useSpotlight";

const PROJECT_ART: Record<string, { gradient: string; Icon: typeof Dumbbell }> = {
  atheleos: { gradient: "from-violet-600 via-indigo-600 to-blue-600", Icon: Dumbbell },
  hrms: { gradient: "from-cyan-500 via-sky-600 to-blue-700", Icon: Users },
  "ai-voice": { gradient: "from-fuchsia-600 via-violet-600 to-indigo-700", Icon: Mic },
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
    <section id="projects" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Projects"
          title="Featured Projects"
          description="Real products, built end to end — a live social platform, a production HR system, and an open-source AI voice platform."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, i) => {
            const art = PROJECT_ART[project.id] ?? PROJECT_ART.atheleos;
            const ArtIcon = art.Icon;
            return (
            <Reveal key={project.id} delay={i * 0.08} className="h-full">
              <article
                onMouseMove={handleSpotlightMove}
                className="spotlight group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-[0_24px_50px_-20px_var(--glow)]"
              >
                {/* gradient cover band */}
                <div className={`relative h-32 shrink-0 overflow-hidden bg-gradient-to-br ${art.gradient}`}>
                  <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
                  <span
                    className="font-display absolute -bottom-5 left-4 text-[88px] leading-none font-bold text-white/15 select-none"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <ArtIcon
                    className="absolute right-4 bottom-3 h-14 w-14 text-white/25 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                    aria-hidden="true"
                  />
                  <span className="absolute top-4 right-4 rounded-full bg-black/30 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                    {project.status}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-[22px] font-bold text-foreground">{project.name}</h3>
                <p className="mt-1 text-sm font-medium text-accent-2">{project.tagline}</p>
                <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted">{project.description}</p>
                {project.highlight ? (
                  <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Trophy className="h-4 w-4 text-accent" />
                    {project.highlight}
                  </p>
                ) : null}
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${project.name} technologies`}>
                  {project.technologies.slice(0, 6).map((tech) => (
                    <li key={tech} className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[11px] text-muted">
                      {tech}
                    </li>
                  ))}
                  {project.technologies.length > 6 ? (
                    <li className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[11px] text-muted">
                      +{project.technologies.length - 6}
                    </li>
                  ) : null}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                  <button
                    type="button"
                    onClick={() => setSelected(project)}
                    className="btn-primary rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
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
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent"
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
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={close}
            role="presentation"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${selected.name} — project details`}
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-surface p-6 shadow-[0_40px_90px_-30px_var(--glow)] sm:rounded-3xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">{selected.name}</h3>
                  <p className="mt-1 text-sm font-medium text-accent-2">{selected.tagline}</p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close project details"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <span className="mt-4 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                {selected.status}
              </span>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{selected.description}</p>
              {selected.highlight ? (
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Trophy className="h-4 w-4 text-accent" />
                  {selected.highlight}
                </p>
              ) : null}
              <h4 className="mt-6 text-sm font-semibold tracking-wide text-foreground uppercase">Key features</h4>
              <ul className="mt-3 space-y-2">
                {selected.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <h4 className="mt-6 text-sm font-semibold tracking-wide text-foreground uppercase">Technologies</h4>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {selected.technologies.map((tech) => (
                  <li key={tech} className="rounded-md bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted">
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
                        ? "btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                        : "inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent"
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
