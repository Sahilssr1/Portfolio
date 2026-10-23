"use client";

import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/data/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 sm:px-8 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <p className="font-display text-base font-bold text-foreground">
            Sahil<span className="text-gradient"> Kumar</span>
          </p>
          <p className="mt-1 text-sm text-muted">Building scalable applications and thoughtful digital experiences.</p>
          <p className="mt-2 text-xs text-muted">© {year} Sahil Kumar. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Sahil Kumar on GitHub"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-foreground"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="Sahil Kumar on LinkedIn"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-foreground"
          >
            <Linkedin className="h-[18px] w-[18px]" />
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            aria-label="Email Sahil Kumar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-foreground"
          >
            <Mail className="h-[18px] w-[18px]" />
          </a>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-transform hover:scale-105"
          >
            <ArrowUp className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
