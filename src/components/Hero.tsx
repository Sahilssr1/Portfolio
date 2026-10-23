"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Download, Github, Hand, Linkedin, Zap } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/data/content";

const ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Web & Mobile App Developer",
  "Open-Source Builder",
];

const STACK = ["C#", "ASP.NET", "React", "TypeScript", "Flutter", "FastAPI", "MySQL", "PostgreSQL"];
const CHIP_COLORS = [
  "hover:bg-pop-yellow",
  "hover:bg-pop-pink",
  "hover:bg-pop-mint",
  "hover:bg-pop-sky",
  "hover:bg-pop-yellow",
  "hover:bg-pop-pink",
  "hover:bg-pop-mint",
  "hover:bg-pop-sky",
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

function MegaLine({
  text,
  className,
  delayBase,
  reduce,
}: {
  text: string;
  className: string;
  delayBase: number;
  reduce: boolean;
}) {
  return (
    <span className={`block whitespace-nowrap ${className}`} aria-hidden="true">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={reduce ? { opacity: 0 } : { y: 60, opacity: 0, rotate: 6, scale: 0.8 }}
          animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1, rotate: 0, scale: 1 }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 320, damping: 17, delay: delayBase + i * 0.045 }
          }
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const typed = useTypewriter(!!reduce);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const mascotY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const popIn = (delay: number) => ({
    initial: { opacity: 0, scale: 0.7, rotate: -6 },
    animate: { opacity: 1, scale: 1, rotate: -2 },
    transition: reduce
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 260, damping: 15, delay },
  });

  return (
    <section id="home" ref={sectionRef} className="dots relative overflow-hidden pt-[76px]">
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pt-8 pb-10 sm:px-8 lg:min-h-[calc(100svh-76px)] lg:grid-cols-[1.08fr_0.92fr] lg:pt-8 lg:pb-10">
        <div>
          {siteConfig.showAvailability ? (
            <motion.p {...popIn(0.05)}>
              <span className="pop-sm font-label inline-flex items-center gap-2.5 rounded-full bg-pop-yellow px-4 py-2 text-[13px] tracking-[0.12em] text-ink uppercase">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ink" />
                </span>
                Open to Work — Let&apos;s Build Something
              </span>
            </motion.p>
          ) : null}

          <h1 aria-label="Sahil Kumar — Full Stack Developer" className="font-display mt-6 uppercase">
            <MegaLine
              text="Sahil"
              reduce={!!reduce}
              delayBase={0.12}
              className="text-[clamp(2.9rem,7.2vw,5.6rem)] leading-[0.95] text-ink"
            />
            <span className="flex items-center gap-3 sm:gap-5">
              <MegaLine
                text="Kumar"
                reduce={!!reduce}
                delayBase={0.38}
                className="shrink-0 text-[clamp(2.9rem,7.2vw,5.6rem)] leading-[0.95] text-pop-violet"
              />
              <motion.span
                aria-hidden="true"
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 10 }}
                transition={
                  reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 12, delay: 0.72 }
                }
                className="pop-sm flex h-[clamp(2.9rem,5.5vw,4.4rem)] w-[clamp(2.9rem,5.5vw,4.4rem)] shrink-0 items-center justify-center rounded-full bg-pop-pink"
              >
                <Zap className="h-[55%] w-[55%] fill-ink text-ink" />
              </motion.span>
            </span>
            <MegaLine
              text="Full-Stack"
              reduce={!!reduce}
              delayBase={0.62}
              className="text-[clamp(1.8rem,4.2vw,3.3rem)] leading-[1.02] text-ink"
            />
            <MegaLine
              text="Developer"
              reduce={!!reduce}
              delayBase={0.95}
              className="text-[clamp(1.8rem,4.2vw,3.3rem)] leading-[1.02] text-pop-pink"
            />
          </h1>

          {/* role typewriter sticker */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { delay: 1.15, duration: 0.45, ease: "easeOut" }}
            className="mt-5"
          >
            {reduce ? (
              <p className="font-label pop-sm inline-block rounded-full bg-paper px-4 py-2 text-sm tracking-[0.1em] text-ink uppercase">
                Software Engineer | Full Stack Developer
              </p>
            ) : (
              <>
                <span className="sr-only">Software Engineer and Full Stack Developer</span>
                <p
                  aria-hidden="true"
                  className="pop-sm font-label inline-flex min-h-[42px] items-center rounded-full bg-paper px-4 py-2 text-sm tracking-[0.1em] text-ink uppercase"
                >
                  I&apos;m a&nbsp;<span className="text-pop-violet">{typed}</span>
                  <span className="ml-1.5 inline-block h-[1em] w-[8px] animate-pulse bg-ink" />
                </p>
              </>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { delay: 1.28, duration: 0.5, ease: "easeOut" }}
            className="mt-5 max-w-xl text-lg leading-snug font-semibold text-ink"
          >
            I build{" "}
            <span className="pop-sm inline-block -rotate-1 bg-pop-yellow px-2 py-0.5">web, mobile &amp; AI products</span>{" "}
            that actually ship — no fluff, just working software.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { delay: 1.36, duration: 0.5, ease: "easeOut" }}
            className="mt-3 max-w-xl text-[15px] leading-relaxed font-medium text-ink/70"
          >
            I&apos;m a full-stack developer focused on building reliable web and mobile applications, backend APIs,
            database-driven systems, and modern user experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { delay: 1.46, duration: 0.5, ease: "easeOut" }}
            className="mt-7 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="pop pop-hover pop-press font-label inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm tracking-[0.08em] text-cream uppercase"
            >
              See My Work <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.resumePath}
              download
              className="pop pop-hover pop-press font-label inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm tracking-[0.08em] text-ink uppercase"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>
            <div className="flex items-center gap-3">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                aria-label="Sahil Kumar on GitHub"
                className="pop-sm pop-hover inline-flex h-11 w-11 rotate-2 items-center justify-center rounded-2xl bg-paper text-ink"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="Sahil Kumar on LinkedIn"
                className="pop-sm pop-hover inline-flex h-11 w-11 -rotate-2 items-center justify-center rounded-2xl bg-paper text-ink"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.05, delayChildren: 1.55 } } }}
            className="mt-7 flex flex-wrap gap-2.5"
            aria-label="Core technologies"
          >
            {STACK.map((tech, i) => (
              <motion.li
                key={tech}
                variants={{
                  hidden: { opacity: 0, y: 14, scale: 0.8 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
                className={`pop-sm cursor-default rounded-full bg-paper px-3.5 py-1.5 font-mono text-xs font-semibold text-ink transition-colors ${CHIP_COLORS[i]}`}
              >
                {tech}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Mascot sticker card */}
        <motion.div style={reduce ? undefined : { y: mascotY }} className="relative mx-auto w-full max-w-[300px] sm:max-w-[330px]">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 160, damping: 15, delay: 0.55 }}
            className="relative"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              className="pop-lg relative overflow-hidden rounded-[26px] bg-cream"
            >
              <Image
                src="/mascot.webp"
                alt="Glossy 3D mascot shaped like a code symbol, waving hello"
                width={760}
                height={1520}
                priority
                className="h-auto w-full"
              />
              <span className="pop-sm font-label absolute bottom-4 left-4 inline-flex -rotate-3 items-center gap-1.5 rounded-full bg-paper px-3.5 py-1.5 text-[13px] tracking-[0.1em] text-ink uppercase">
                <Hand className="h-4 w-4" /> Hi! I write code
              </span>
            </motion.div>

            {/* burst sticker — real HRMS fact */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 10 }}
              transition={
                reduce ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 12, delay: 1.0 }
              }
              className="pop-sm font-label absolute -top-7 -left-5 flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full bg-pop-yellow text-center text-[11px] leading-tight tracking-wide text-ink uppercase sm:-left-9"
              aria-label="5,000 plus downloads on Google Play"
            >
              <span className="text-lg font-bold">5,000+</span>
              <span>Downloads</span>
              <span>on Play Store</span>
            </motion.div>

            {/* live sticker */}
            <motion.a
              href="https://atheleos.in"
              target="_blank"
              rel="noreferrer"
              initial={{ scale: 0, rotate: 12 }}
              animate={{ scale: 1, rotate: -4 }}
              transition={
                reduce ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 12, delay: 1.15 }
              }
              className="pop-sm pop-hover font-label absolute -right-3 -bottom-5 rounded-full bg-pop-mint px-4 py-2 text-[13px] tracking-[0.1em] text-ink uppercase sm:-right-6"
            >
              Atheleos.in — Live ↗
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative pb-6 text-center">
        <a
          href="#about"
          aria-label="Scroll down to About"
          className="font-label group inline-flex flex-col items-center gap-2 text-xs tracking-[0.22em] text-ink/60 uppercase transition-colors hover:text-ink"
        >
          Scroll
          <motion.span
            aria-hidden="true"
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="pop-sm flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink"
          >
            <ArrowDown className="h-4 w-4" />
          </motion.span>
        </a>
      </div>
    </section>
  );
}
