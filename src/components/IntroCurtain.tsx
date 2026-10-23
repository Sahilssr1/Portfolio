"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Brief cinematic intro curtain — shown once per browser session,
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
    }, 1050);
    return () => clearTimeout(timer);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06060c]"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-display text-4xl font-bold tracking-tight text-white"
          >
            Sahil<span className="text-gradient"> Kumar</span>
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
