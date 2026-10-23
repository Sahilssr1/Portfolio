"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Global motion settings — animations automatically soften for users who prefer reduced motion. */
export default function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
