"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, Download, Github, Linkedin } from "lucide-react";
import { siteConfig } from "@/data/content";

const ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Web & Mobile App Developer",
  "Open-Source Builder",
];

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

/** Typewriter that cycles through roles. Returns "" when reduced motion is preferred. */
function useTypewriter(disabled: boolean): string {
  const [text, setText] = useState("");
  useEffect(() => {
    if (disabled) return;
    let role = 0;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = ROLES[role];
      char += deleting ? -1 : 1;
      setText(current.slice(0, char));
      let delay = deleting ? 34 : 68;
      if (!deleting && char === current.length) {
        delay = 1700;
        deleting = true;
      } else if (deleting && char === 0) {
        deleting = false;
        role = (role + 1) % ROLES.length;
        delay = 350;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [disabled]);
  return text;
}

const NAME_LETTERS = "SAHIL KUMAR".split("");

export default function Hero() {
  const reduce = useReducedMotion();
  const typed = useTypewriter(!!reduce);
  const sectionRef = useRef<HTMLElement>(null);

  /* parallax drift for the ambient orbs + visual (disabled for reduced motion) */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -46]);

  /* gentle 3D tilt on the code card (fine pointers only) */
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 20 });
  const onTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 7);
    rx.set(-py * 7);
  };
  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
  };

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: reduce
      ? { duration: 0 }
      : { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="home" ref={sectionRef} className="relative overflow-hidden pt-[72px]">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: orbY }}
        className="absolute -top-40 left-[8%] h-96 w-96 rounded-full bg-accent/20 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: orbY }}
        className="absolute top-24 right-[4%] h-80 w-80 rounded-full bg-accent-2/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pt-16 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24 lg:pb-28">
        <div>
          {siteConfig.showAvailability ? (
            <motion.p {...rise(0.02)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-muted backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {siteConfig.availabilityLabel}
              </span>
            </motion.p>
          ) : null}

          <h1
            aria-label="Sahil Kumar"
            className="font-display mt-7 text-[56px] leading-[0.98] font-bold tracking-tight text-foreground sm:text-7xl lg:text-[84px]"
          >
            <span aria-hidden="true" className="block overflow-hidden pb-1">
              {NAME_LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block whitespace-pre"
                  initial={reduce ? { opacity: 0 } : { y: "110%", rotate: 4 }}
                  animate={reduce ? { opacity: 1 } : { y: 0, rotate: 0 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: 0.75, delay: 0.08 + i * 0.038, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* role line: typewriter on motion-safe, static text otherwise */}
          <div className="mt-4 font-mono text-base font-medium tracking-wide text-accent sm:text-lg">
            {reduce ? (
              <p>Software Engineer | Full Stack Developer</p>
            ) : (
              <>
                <span className="sr-only">Software Engineer and Full Stack Developer</span>
                <p aria-hidden="true" className="min-h-[1.6em]">
                  <span className="text-gradient font-semibold">{typed}</span>
                  <span className="ml-1 inline-block h-[1.05em] w-[8px] translate-y-[0.18em] animate-pulse bg-accent" />
                </p>
              </>
            )}
          </div>

          <motion.p
            {...rise(0.34)}
            className="mt-7 text-[26px] leading-snug font-semibold text-foreground/90 sm:text-[32px]"
          >
            Building scalable applications and{" "}
            <span className="font-accent text-gradient pr-1 font-semibold italic">
              thoughtful digital experiences.
            </span>
          </motion.p>

          <motion.p {...rise(0.42)} className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            I&apos;m a full-stack developer focused on building reliable web and mobile applications, backend
            APIs, database-driven systems, and modern user experiences.
          </motion.p>

          <motion.div {...rise(0.5)} className="mt-9 flex flex-wrap items-center gap-4">
            <motion.a
              href="#projects"
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className="btn-primary rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Explore My Work
            </motion.a>
            <motion.a
              href={siteConfig.resumePath}
              download
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:shadow-[0_0_24px_-6px_var(--glow)]"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </motion.a>
            <div className="flex items-center gap-2">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                aria-label="Sahil Kumar on GitHub"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all hover:-translate-y-0.5 hover:text-foreground hover:shadow-[0_0_24px_-6px_var(--glow)]"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="Sahil Kumar on LinkedIn"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all hover:-translate-y-0.5 hover:text-foreground hover:shadow-[0_0_24px_-6px_var(--glow)]"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.05, delayChildren: 0.6 } } }}
            className="mt-10 flex flex-wrap gap-2"
            aria-label="Core technologies"
          >
            {STACK.map((tech) => (
              <motion.li
                key={tech}
                variants={{
                  hidden: { opacity: 0, y: 12, scale: 0.94 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="rounded-full bg-accent-soft px-3 py-1 font-mono text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-white"
              >
                {tech}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Code-inspired visual with parallax + tilt */}
        <motion.div
          style={reduce ? undefined : { y: cardY }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
            style={{ perspective: 1000 }}
            onMouseMove={onTilt}
            onMouseLeave={resetTilt}
          >
            <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-br from-accent/30 via-transparent to-accent-2/25 blur-2xl" aria-hidden="true" />
            <motion.div
              aria-hidden="true"
              style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c15]/95 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.7)] backdrop-blur"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 font-mono text-xs text-zinc-500">developer.ts</span>
                <span className="ml-auto hidden items-center gap-1.5 font-mono text-[10px] text-zinc-500 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> main
                </span>
              </div>
              <div className="space-y-2.5 px-5 py-5 font-mono text-[12.5px] leading-relaxed sm:text-[13.5px]">
                {CODE_LINES.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.75 + i * 0.09 }}
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
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative pb-10 text-center">
        <a
          href="#about"
          aria-label="Scroll down to About"
          className="group inline-flex flex-col items-center gap-2 text-xs font-medium tracking-widest text-muted uppercase transition-colors hover:text-foreground"
        >
          Scroll
          <span className="flex h-9 w-[22px] justify-center rounded-full border border-border pt-1.5 transition-colors group-hover:border-accent">
            <motion.span
              aria-hidden="true"
              className="h-2 w-1 rounded-full bg-accent"
              animate={reduce ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          <ArrowDown className="sr-only" />
        </a>
      </div>
    </section>
  );
}
