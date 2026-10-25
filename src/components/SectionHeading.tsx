"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  /** Tailwind bg class for the eyebrow sticker, e.g. "bg-pop-yellow". */
  accentClass?: string;
  /** Use on dark/colored sections: title and description switch to cream. */
  tone?: "ink" | "cream";
  /** Background color for the sticker shadow contrast on colored sections. */
  shadowClass?: string;
  /** Replaces the animated h2 entirely, e.g. a GravityLetters heading. */
  titleNode?: ReactNode;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  accentClass = "bg-pop-yellow",
  tone = "ink",
  shadowClass = "",
  titleNode,
}: SectionHeadingProps) {
  const reduce = useReducedMotion();
  const words = title.split(" ");
  const lastWord = words[words.length - 1];
  const headWords = words.slice(0, -1);
  return (
    <div className="mb-14 max-w-3xl">
      <motion.p
        initial={{ opacity: 0, x: -16, rotate: -4 }}
        whileInView={{ opacity: 1, x: 0, rotate: -2 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 16 }}
        className={`font-label inline-block rounded-full px-4 py-1.5 text-sm tracking-[0.14em] uppercase ${accentClass} ${shadowClass || "pop-sm"} text-ink`}
      >
        ★ {eyebrow}
      </motion.p>
      {titleNode ? (
        <div className="mt-6">{titleNode}</div>
      ) : (
        <h2
          className={`font-display mt-6 text-4xl leading-[1.04] uppercase sm:text-5xl ${
            tone === "cream" ? "text-cream" : "text-ink"
          }`}
        >
          {headWords.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className="inline-block"
                initial={reduce ? { opacity: 0 } : { y: "108%" }}
                whileInView={reduce ? { opacity: 1 } : { y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={
                  reduce ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 21, delay: 0.07 * i }
                }
              >
                {word}
                {"\u00A0"}
              </motion.span>
            </span>
          ))}
          <span className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span
              className={`inline-block ${tone === "cream" ? "text-pop-yellow" : "text-pop-violet"}`}
              initial={reduce ? { opacity: 0 } : { y: "108%" }}
              whileInView={reduce ? { opacity: 1 } : { y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 210, damping: 21, delay: 0.07 * headWords.length }
              }
            >
              {lastWord}
            </motion.span>
          </span>
        </h2>
      )}
      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.18, ease: "easeOut" }}
          className={`mt-5 max-w-2xl text-base leading-relaxed font-medium ${
            tone === "cream" ? "text-cream/85" : "text-ink/70"
          }`}
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}
