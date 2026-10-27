"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

type Pose = "wave" | "walking" | "typing" | "thinking" | "celebrating";

const POSES: { id: Pose; label: string; bubble: string }[] = [
  { id: "wave", label: "waving hello", bubble: "Hi! I write code" },
  { id: "walking", label: "walking", bubble: "Let's build something" },
  { id: "typing", label: "typing code", bubble: "Shipping code…" },
  { id: "thinking", label: "thinking", bubble: "Hmm, let me think…" },
  { id: "celebrating", label: "celebrating", bubble: "It works!" },
];

/** Which pose the character shows while each section is on screen. */
const SECTION_POSE: Record<string, Pose> = {
  home: "wave",
  about: "thinking",
  experience: "typing",
  projects: "celebrating",
  skills: "typing",
  education: "walking",
  github: "walking",
  contact: "celebrating",
};

/**
 * Floating 3D character companion. It follows the visitor down the page and
 * changes pose to match the section in view — waving on the hero, thinking
 * on About, typing on Experience, celebrating on Projects and Contact.
 * Tap it to cycle poses by hand; the × hides it (a small button brings it back).
 */
export default function DevCharacter() {
  const reduce = useReducedMotion();
  const [pose, setPose] = useState<Pose>("wave");
  const [visible, setVisible] = useState(true);
  // Tapping a pose holds it for a few seconds before scroll takes over again.
  const manualUntil = useRef(0);

  useEffect(() => {
    const sections = Object.keys(SECTION_POSE)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < manualUntil.current) return;
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!inView) return;
        const next = SECTION_POSE[inView.target.id];
        if (next) setPose(next);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const current = POSES.find((p) => p.id === pose) ?? POSES[0];

  const cycle = () => {
    const i = POSES.findIndex((p) => p.id === pose);
    const next = POSES[(i + 1) % POSES.length];
    manualUntil.current = Date.now() + 6000;
    setPose(next.id);
  };

  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => setVisible(true)}
        aria-label="Show the 3D character"
        title="Show the 3D character"
        className="pop-sm fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-white shadow-[3px_3px_0_#141414] transition-transform hover:-translate-y-0.5"
      >
        <Image
          src="/character/wave.webp"
          alt=""
          width={48}
          height={48}
          className="h-10 w-10 object-cover object-top"
        />
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6">
      <AnimatePresence mode="wait">
        <motion.span
          key={current.id}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.95 }}
          transition={{ duration: 0.18 }}
          className="pop-sm font-label max-w-[190px] rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-center text-[11px] tracking-wide text-ink uppercase shadow-[3px_3px_0_#141414]"
        >
          {current.bubble}
        </motion.span>
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={cycle}
        aria-label={`3D character, currently ${current.label}. Tap to change pose.`}
        title="Tap me to change pose"
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="pop-sm group relative block w-[88px] overflow-hidden rounded-[20px] border-2 border-ink bg-white shadow-[4px_4px_0_#141414] transition-transform hover:-translate-y-1 sm:w-[124px]"
      >
        <span className="relative block aspect-[2/3] w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <Image
                src={`/character/${current.id}.webp`}
                alt={`3D character of Sahil ${current.label}`}
                fill
                sizes="128px"
                className="object-contain"
              />
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="pop-sm font-label absolute right-1.5 bottom-1.5 rounded-full bg-ink px-2 py-0.5 text-[9px] tracking-wider text-paper uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          tap me
        </span>
      </motion.button>

      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Hide the 3D character"
        title="Hide the 3D character"
        className="pop-sm flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink shadow-[2px_2px_0_#141414] transition-transform hover:-translate-y-0.5"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
