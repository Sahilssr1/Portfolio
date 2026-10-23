"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ExternalLink, Github, Play, Trophy, X } from "lucide-react";
import { projects, type Project } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

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
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.08} className="h-full">
              <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_16px_44px_-18px_var(--accent)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                    {project.status}
                  </span>
                </div>
                <h3 className="font-display mt-5 text-[22px] font-bold text-foreground">{project.name}</h3>
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
                    className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
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
              </article>
            </Reveal>
          ))}
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
              className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-surface p-6 shadow-2xl sm:rounded-3xl sm:p-8"
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
                {selected.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
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
