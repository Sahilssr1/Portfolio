"use client";

import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/data/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="dots-light overflow-hidden bg-ink pt-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="font-display text-center text-[clamp(2.6rem,8.5vw,6.5rem)] leading-none whitespace-nowrap uppercase select-none">
          <span className="text-outline">Sahil</span> <span className="text-cream">Kumar</span>
          <span className="text-pop-yellow">★</span>
        </p>
        <div className="mt-10 flex flex-col items-center gap-6 pb-10 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-[15px] font-medium text-cream/80">
              Building web, mobile &amp; AI products that actually ship.
            </p>
            <p className="mt-2 text-xs font-medium text-cream/45">© {year} Sahil Kumar. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Sahil Kumar on GitHub"
              className="inline-flex h-11 w-11 rotate-2 items-center justify-center rounded-2xl border-[2.5px] border-ink bg-cream text-ink shadow-[4px_4px_0_#7b61ff] transition-transform hover:-translate-y-1 hover:rotate-0"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="Sahil Kumar on LinkedIn"
              className="inline-flex h-11 w-11 -rotate-2 items-center justify-center rounded-2xl border-[2.5px] border-ink bg-cream text-ink shadow-[4px_4px_0_#ff5cab] transition-transform hover:-translate-y-1 hover:rotate-0"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label="Email Sahil Kumar"
              className="inline-flex h-11 w-11 rotate-2 items-center justify-center rounded-2xl border-[2.5px] border-ink bg-cream text-ink shadow-[4px_4px_0_#31d0aa] transition-transform hover:-translate-y-1 hover:rotate-0"
            >
              <Mail className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="pop-sm font-label ml-1 inline-flex h-11 items-center gap-1.5 rounded-full bg-pop-yellow px-4 text-[13px] tracking-[0.1em] text-ink uppercase transition-transform hover:-translate-y-1"
            >
              <ArrowUp className="h-4 w-4" />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
