"use client";

import type { MouseEvent } from "react";

/** Sets --mx / --my CSS variables so the .spotlight glow follows the cursor. */
export function handleSpotlightMove(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}
