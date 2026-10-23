"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin } from "lucide-react";
import { siteConfig } from "@/data/content";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const STACK = ["C#", "ASP.NET", "React", "TypeScript", "Flutter", "FastAPI", "MySQL", "PostgreSQL"];

const CODE_LINES: { indent: number; tokens: { text: string; cls: string }[] }[] = [
  { indent: 0, tokens: [{ text: "const ", cls: "text-violet-400" }, { text: "developer", cls: "text-cyan-300" }, { text: " = {", cls: "text-zinc-300" }] },
  { indent: 1, tokens: [{ text: "name: ", cls: "text-zinc-400" }, { text: '"Sahil Kumar"', cls: "text-emerald-300" }, { text: ",", cls: "text-zinc-300" }] },
  { indent: 1, tokens: [{ text: "role: ", cls: "text-zinc-400" }, { text: '"Full Stack Developer"', cls: "text-emerald-300" }, { text: ",", cls: "text-zinc-300" }] },
  { indent: 1, tokens: [{ text: "stack: [", cls: "text-zinc-400" }, { text: '"ASP.NET"', cls: "text-emerald-300" }, { text: ", ", cls: "text-zinc-300" }, { text: '"React"', cls: "text-emerald-300" }, { text: ", ", cls: "text-zinc-300" }, { text: '"Flutter"', cls: "text-emerald-300" }, { text: "],", cls: "text-zinc-300" }] },
  { indent: 1, tokens: [{ text: "builds: ", cls: "text-zinc-400" }, { text: '"web · mobile · AI"', cls: "text-emerald-300" }, { text: ",", cls: "text-zinc-300" }] },
  { indent: 0, tokens: [{ text: "};", cls: "text-zinc-300" }] },
  { indent: 0, tokens: [{ text: "", cls: "" }] },
  { indent: 0, tokens: [{ text: "await ", cls: "text-violet-400" }, { text: "developer", cls: "text-cyan-300" }, { text: ".", cls: "text-zinc-300" }, { text: "ship", cls: "text-amber-300" }, { text: "();", cls: "text-zinc-300" }] },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const transition = (delay: number) =>
    reduce ? { duration: 0 } : { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section id="home" className="relative overflow-hidden pt-[72px]">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -top-32 left-1/2 h-96 w-[720px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pt-16 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24 lg:pb-28">
        <div>
          {siteConfig.showAvailability ? (
            <motion.p {...fadeUp} transition={transition(0)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {siteConfig.availabilityLabel}
              </span>
            </motion.p>
          ) : null}

          <motion.h1
            {...fadeUp}
            transition={transition(0.08)}
            className="font-display mt-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-[64px] lg:leading-[1.05]"
          >
            Sahil Kumar
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={transition(0.16)}
            className="mt-3 font-mono text-sm font-medium tracking-wide text-accent sm:text-base"
          >
            Software Engineer | Full Stack Developer
          </motion.p>

          <motion.p
            {...fadeUp}
            transition={transition(0.24)}
            className="mt-6 text-2xl font-semibold leading-snug text-foreground/90 sm:text-[28px]"
          >
            Building scalable applications and thoughtful digital experiences.
          </motion.p>

          <motion.p {...fadeUp} transition={transition(0.32)} className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            I&apos;m a full-stack developer focused on building reliable web and mobile applications, backend
            APIs, database-driven systems, and modern user experiences.
          </motion.p>

          <motion.div {...fadeUp} transition={transition(0.4)} className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Explore My Work
            </a>
            <a
              href={siteConfig.resumePath}
              download
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
            <div className="flex items-center gap-2">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                aria-label="Sahil Kumar on GitHub"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="Sahil Kumar on LinkedIn"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-foreground"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.ul {...fadeUp} transition={transition(0.48)} className="mt-10 flex flex-wrap gap-2" aria-label="Core technologies">
            {STACK.map((tech) => (
              <li
                key={tech}
                className="rounded-full bg-accent-soft px-3 py-1 font-mono text-xs font-medium text-accent"
              >
                {tech}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Code-inspired visual */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32, rotate: 1 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, rotate: 0 }}
          transition={transition(0.35)}
          className="relative mx-auto w-full max-w-[520px]"
          aria-hidden="true"
        >
          <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-br from-accent/25 via-transparent to-accent-2/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d15] shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-zinc-500">developer.ts</span>
            </div>
            <div className="space-y-2.5 px-5 py-5 font-mono text-[12.5px] leading-relaxed sm:text-[13.5px]">
              {CODE_LINES.map((line, i) => (
                <motion.p
                  key={i}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.55 + i * 0.09 }}
                  style={{ paddingLeft: `${line.indent * 22}px` }}
                  className="whitespace-pre"
                >
                  {line.tokens.map((tok, j) => (
                    <span key={j} className={tok.cls}>
                      {tok.text}
                    </span>
                  ))}
                  {line.tokens.length === 1 && line.tokens[0].text === "" ? "\u00A0" : null}
                </motion.p>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 font-mono text-[11px] text-zinc-500">
              <span>TypeScript · strict</span>
              <span className="text-emerald-400">● production-ready</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative pb-10 text-center">
        <a
          href="#about"
          aria-label="Scroll down to About"
          className="inline-flex flex-col items-center gap-2 text-xs font-medium tracking-widest text-muted uppercase transition-colors hover:text-foreground"
        >
          Scroll
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
