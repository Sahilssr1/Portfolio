"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable — theme still toggles for this session */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted && !isDark ? "Switch to dark theme" : "Switch to light theme"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:text-foreground"
    >
      {mounted && !isDark ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
    </button>
  );
}
