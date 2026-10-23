"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { experience } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const POINT_STARS = ["text-pop-violet", "text-pop-pink", "text-pop-mint", "text-pop-sky"];

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 78%", "end 55%"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  return (
    <section id="experience" className="dots scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Experience"
          title="My Journey So Far"
          description="One company, a clear progression — from web development intern to full-time full stack developer at Sanjivani Media and Technology."
          accentClass="bg-pop-pink"
        />
        <ol ref={listRef} className="relative ml-2 space-y-10 pl-10 sm:ml-4 sm:pl-12">
          {/* thick ink line + scroll-drawn violet progress */}
          <span className="absolute top-2 bottom-2 left-[7px] w-[3.5px] rounded bg-ink/15" aria-hidden="true" />
          <motion.span
            aria-hidden="true"
            style={reduce ? undefined : { scaleY: lineScale }}
            className="absolute top-2 bottom-2 left-[7px] w-[3.5px] origin-top rounded bg-pop-violet"
          />
          {experience.map((item, i) => (
            <Reveal key={item.role} delay={i * 0.08}>
              <li className="group relative">
                <span
                  className={`pop-sm absolute top-6 -left-10 h-[18px] w-[18px] rounded-full sm:-left-12 ${
                    item.current ? "bg-pop-yellow" : "bg-paper"
                  }`}
                  aria-hidden="true"
                />
                <article className="pop pop-hover rounded-3xl bg-paper p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
                    <h3 className="text-xl font-bold text-ink sm:text-2xl">{item.role}</h3>
                    {item.current ? (
                      <span className="pop-sm font-label rounded-full bg-pop-mint px-3 py-1 text-xs tracking-[0.12em] text-ink uppercase">
                        Current role
                      </span>
                    ) : null}
                    <span
                      className={`pop-sm font-label ml-auto rounded-full px-3 py-1 text-xs tracking-[0.1em] text-ink uppercase ${
                        item.current ? "bg-pop-pink" : "bg-pop-yellow"
                      }`}
                    >
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[15px] font-semibold text-pop-violet">{item.company}</p>
                  <ul className="mt-4 grid max-w-3xl gap-y-2">
                    {item.points.map((point, pi) => (
                      <li key={point} className="flex gap-2.5 text-[15px] leading-relaxed font-medium text-ink/75">
                        <span className={`mt-0.5 shrink-0 ${POINT_STARS[pi % POINT_STARS.length]}`} aria-hidden="true">
                          ★
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
