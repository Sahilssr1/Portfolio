"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/data/content";

const SECTION_IDS = ["home", "about", "experience", "projects", "skills", "contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b-[3px] border-ink bg-cream/95 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-[5px] origin-left border-b-2 border-ink bg-pop-yellow"
      />
      <nav aria-label="Primary" className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#home"
          className="pop-sm font-display inline-block -rotate-2 bg-ink px-3.5 py-2 text-lg text-pop-yellow transition-transform hover:rotate-0"
          aria-label="Sahil Kumar — home"
        >
          SK<span className="text-pop-pink">★</span>
        </a>

        <ul className="pop hidden items-center gap-1 rounded-full bg-paper px-2.5 py-2 lg:flex">
          {navLinks.map((link) => {
            const id = link.href.slice(1);
            const isActive = active === id;
            return (
              <li key={link.href} className="relative">
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`font-label relative block rounded-full px-4 py-1.5 text-[15px] tracking-[0.08em] uppercase transition-colors ${
                    isActive ? "text-cream" : "text-ink hover:bg-pop-yellow"
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="pop-sm pop-hover pop-press font-label hidden rotate-1 rounded-full bg-pop-pink px-5 py-2.5 text-[15px] tracking-[0.08em] text-ink uppercase sm:inline-block"
          >
            Let&apos;s Talk →
          </a>
          <button
            type="button"
            className="pop-sm inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-b-[3px] border-ink bg-cream lg:hidden"
          >
            <ul className="space-y-2 px-5 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="pop-sm font-label block rounded-2xl bg-paper px-4 py-3 text-base tracking-[0.08em] text-ink uppercase"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-1">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="pop-sm font-label block rounded-full bg-pop-pink px-5 py-3 text-center text-base tracking-[0.08em] text-ink uppercase"
                >
                  Let&apos;s Talk →
                </a>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <span className="sr-only">{siteConfig.name}</span>
    </header>
  );
}
