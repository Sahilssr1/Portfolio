"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  const reduce = useReducedMotion();
  const words = title.split(" ");
  return (
    <div className="mb-12 max-w-2xl">
      <motion.p
        initial={{ opacity: 0, x: -14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
        className="flex items-center gap-3 font-mono text-sm font-medium tracking-widest text-accent uppercase"
      >
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent" aria-hidden="true" />
        {eyebrow}
      </motion.p>
      <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-[40px] sm:leading-[1.15]">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span
              className="inline-block"
              initial={reduce ? { opacity: 0 } : { y: "105%" }}
              whileInView={reduce ? { opacity: 1 } : { y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.6, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }
              }
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </h2>
      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.55, delay: 0.15, ease: "easeOut" }}
          className="mt-4 text-base leading-relaxed text-muted"
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}
