"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Brief sticker-style intro curtain — shown once per browser session,
 * lifts away to reveal the hero. Content is never blocked for
 * no-JS visitors or users who prefer reduced motion.
 */
export default function IntroCurtain() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
    } catch {
      seen = false;
    }
    if (seen || reduce) return;
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {
        /* storage unavailable */
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          aria-hidden="true"
          className="dots-light fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ type: "spring", stiffness: 220, damping: 15 }}
            className="font-display text-center text-4xl text-cream uppercase sm:text-6xl"
          >
            Sahil <span className="text-pop-violet">Kumar</span>
            <span className="text-pop-yellow"> ★</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="font-label mt-4 rounded-full bg-pop-pink px-4 py-1.5 text-sm tracking-[0.18em] text-ink uppercase"
          >
            Full-Stack Developer
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
