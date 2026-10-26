"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type CSSProperties,
} from "react";

/**
 * ElasticLettering — an original elastic-band headline, written from scratch
 * for this site (no physics library, no copied source).
 *
 * Behaviour modelled on the public React Bits Pro "Elastic Lettering" props
 * table: each letter is a spring on an elastic band. Grab a letter and it
 * follows the pointer (growing slightly while held); neighbours are pulled
 * along by tension; letters lean along the curve of the band and stretch
 * along fast motion; while stretched they warm toward the tension colour.
 * Releasing mid-swipe flings the letter with the pointer's speed, then it
 * springs home and wobbles as it settles. Clicking a letter without dragging
 * plucks it and sends a ripple along the line.
 */

export type ElasticLetteringHandle = {
  /** Pluck a letter by position (middle letter when omitted), rippling along the line. */
  pluck: (index?: number, strength?: number) => void;
};

export type ElasticLetteringProps = {
  text: string;
  fontSize?: number | string;
  fontWeight?: number;
  fontFamily?: string;
  letterSpacing?: string;
  lineHeight?: number;
  align?: "left" | "center" | "right";
  color?: string;
  tensionColor?: string;
  tensionTint?: number;
  tension?: number;
  stiffness?: number;
  bounce?: number;
  reach?: number;
  squash?: number;
  tilt?: number;
  lift?: number;
  throwable?: boolean;
  pluckOnClick?: boolean;
  pluckStrength?: number;
  hint?: boolean;
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
};

type LetterState = { x: number; y: number; vx: number; vy: number };
type QueuedPluck = { index: number; at: number; strength: number };
type TrailPoint = { x: number; y: number; t: number };

type Grab = {
  index: number;
  homeX: number;
  homeY: number;
  targetX: number;
  targetY: number;
  moved: boolean;
  downX: number;
  downY: number;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function parseRgb(color: string): [number, number, number] | null {
  const m = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let hex = m[1];
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixRgb(a: [number, number, number], b: [number, number, number], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

const ElasticLettering = forwardRef<ElasticLetteringHandle, ElasticLetteringProps>(function ElasticLettering(
  {
    text,
    fontSize,
    fontWeight,
    fontFamily,
    letterSpacing,
    lineHeight = 1.05,
    align = "center",
    color,
    tensionColor = "#B15CFF",
    tensionTint = 0.8,
    tension = 0.6,
    stiffness = 1,
    bounce = 0.62,
    reach = 4,
    squash = 0.5,
    tilt = 0.5,
    lift = 0.5,
    throwable = true,
    pluckOnClick = true,
    pluckStrength = 1,
    hint = false,
    interactive = true,
    className,
    style,
  },
  ref,
) {
  const letters = useMemo(() => text.split(""), [text]);
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const statesRef = useRef<LetterState[] | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const grabRef = useRef<Grab | null>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const queueRef = useRef<QueuedPluck[]>([]);
  const reachPxRef = useRef(120);
  const fontPxRef = useRef(64);
  const reduceRef = useRef(false);
  const lastColorRef = useRef<string[]>([]);

  // Latest props for the rAF loop (avoids stale closures).
  const propsRef = useRef({ tension, stiffness, bounce, squash, tilt, lift, tensionTint });
  useEffect(() => {
    propsRef.current = { tension, stiffness, bounce, squash, tilt, lift, tensionTint };
  });

  if (!statesRef.current || statesRef.current.length !== letters.length) {
    statesRef.current = letters.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    lastColorRef.current = letters.map(() => "");
  }

  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  const renderFrame = useCallback(() => {
    const states = statesRef.current;
    const base = color ? parseRgb(color) : null;
    const tensionRgb = parseRgb(tensionColor);
    const { squash: sq, tilt: tl, lift: lf, tensionTint: tt } = propsRef.current;
    if (!states) return;
    const n = states.length;
    for (let i = 0; i < n; i++) {
      const el = letterRefs.current[i];
      if (!el) continue;
      const s = states[i];
      const speed = Math.hypot(s.vx, s.vy);
      const stretch = clamp(Math.hypot(s.x, s.y) / Math.max(1, reachPxRef.current), 0, 1);

      // Lean along the curve of the band (slope to the neighbours).
      const prevY = i > 0 ? states[i - 1].y : s.y;
      const nextY = i < n - 1 ? states[i + 1].y : s.y;
      const tiltDeg = clamp(
        (Math.atan2(nextY - prevY, fontPxRef.current) * 180) / Math.PI,
        -35,
        35,
      ) * tl;

      // Stretch along the direction of motion when moving fast.
      const sqAmt = sq * clamp(speed / 900, 0, 1);
      const velDeg = speed > 40 ? (Math.atan2(s.vy, s.vx) * 180) / Math.PI : 0;
      const held = grabRef.current?.index === i;
      const liftScale = held ? 1 + lf * 0.22 : 1;
      el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${tiltDeg.toFixed(2)}deg) rotate(${velDeg.toFixed(2)}deg) scale(${(1 + sqAmt).toFixed(3)}, ${(1 - 0.45 * sqAmt).toFixed(3)}) rotate(${(-velDeg).toFixed(2)}deg) scale(${liftScale.toFixed(3)})`;

      // Warm toward the tension colour while stretched.
      if (base && tensionRgb) {
        const c = mixRgb(base, tensionRgb, stretch * tt);
        if (lastColorRef.current[i] !== c) {
          el.style.color = c;
          lastColorRef.current[i] = c;
        }
      }
    }
  }, [color, tensionColor]);

  const tick = useCallback(
    (now: number) => {
      const dt = clamp((now - lastRef.current) / 1000, 0.001, 1 / 30);
      lastRef.current = now;
      const states = statesRef.current;
      if (!states) {
        rafRef.current = null;
        return;
      }
      const { tension: tn, stiffness: st, bounce: bn } = propsRef.current;
      const reduce = reduceRef.current;
      // Spring: stiffness = return force; bounce = overshoot (damping ratio).
      const k = st * 170;
      const zeta = reduce ? 1 : 1 - bn * 0.85;
      const c = 2 * zeta * Math.sqrt(k);
      const coupling = tn * 140;

      // Fire any ripple impulses whose time has come.
      const t = now;
      if (queueRef.current.length) {
        queueRef.current = queueRef.current.filter((q) => {
          if (q.at <= t) {
            const s = states[q.index];
            if (s) {
              s.vy -= 420 * q.strength;
              s.vx += (q.index - (states.length - 1) / 2) * 18 * q.strength;
            }
            return false;
          }
          return true;
        });
      }

      let maxOff = 0;
      let maxVel = 0;
      for (let i = 0; i < states.length; i++) {
        const s = states[i];
        const grab = grabRef.current;
        if (grab && grab.index === i) {
          // Held letter: follow the pointer, with growing resistance past reach.
          const dist = Math.hypot(grab.targetX, grab.targetY);
          let tx = grab.targetX;
          let ty = grab.targetY;
          if (dist > reachPxRef.current) {
            const scale = (reachPxRef.current + (dist - reachPxRef.current) * 0.22) / dist;
            tx *= scale;
            ty *= scale;
          }
          s.vx = (tx - s.x) / Math.max(dt, 0.001);
          s.vy = (ty - s.y) / Math.max(dt, 0.001);
          s.x = tx;
          s.y = ty;
        } else {
          let ax = -k * s.x - c * s.vx;
          let ay = -k * s.y - c * s.vy;
          // Neighbour coupling: the band pulls each letter toward its neighbours.
          let nx = 0;
          let ny = 0;
          let count = 0;
          if (i > 0) {
            nx += states[i - 1].x;
            ny += states[i - 1].y;
            count++;
          }
          if (i < states.length - 1) {
            nx += states[i + 1].x;
            ny += states[i + 1].y;
            count++;
          }
          if (count > 0) {
            ax += coupling * (nx / count - s.x);
            ay += coupling * (ny / count - s.y);
          }
          s.vx += ax * dt;
          s.vy += ay * dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
        }
        maxOff = Math.max(maxOff, Math.abs(s.x), Math.abs(s.y));
        maxVel = Math.max(maxVel, Math.abs(s.vx), Math.abs(s.vy));
      }

      renderFrame();

      const settled =
        !grabRef.current && queueRef.current.length === 0 && maxOff < 0.4 && maxVel < 6;
      if (settled) {
        for (const s of states) {
          s.x = 0;
          s.y = 0;
          s.vx = 0;
          s.vy = 0;
        }
        renderFrame();
        rafRef.current = null;
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [renderFrame],
  );

  const ensureLoop = useCallback(() => {
    if (rafRef.current == null) {
      lastRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const pluck = useCallback(
    (index?: number, strength = pluckStrength) => {
      const states = statesRef.current;
      if (!states || states.length === 0) return;
      const mid = Math.floor(states.length / 2);
      const i = index == null ? mid : clamp(index, 0, states.length - 1);
      const reduce = reduceRef.current;
      const now = performance.now();
      if (reduce) {
        // Reduced motion: a gentle nudge on the one letter, no ripple.
        states[i].vy -= 120 * strength * 0.5;
      } else {
        states[i].vy -= 420 * strength;
        states[i].vx += (i - (states.length - 1) / 2) * 18 * strength;
        // Ripple: neighbours fire in sequence, fading with distance.
        for (let d = 1; d < states.length; d++) {
          const s = strength * Math.pow(0.75, d);
          if (s < 0.08) break;
          if (i - d >= 0) queueRef.current.push({ index: i - d, at: now + d * 45, strength: s });
          if (i + d < states.length) queueRef.current.push({ index: i + d, at: now + d * 45, strength: s });
        }
      }
      ensureLoop();
    },
    [ensureLoop, pluckStrength],
  );

  useImperativeHandle(ref, () => ({ pluck }), [pluck]);

  // Hint: one gentle tug the first time the headline scrolls into view.
  useEffect(() => {
    if (!hint || !interactive) return;
    const el = rootRef.current;
    if (!el) return;
    let fired = false;
    let timer: number | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !fired) {
          fired = true;
          timer = window.setTimeout(() => pluck(undefined, 0.7), 600);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [hint, interactive, pluck, letters.length]);

  // Pointer handling: grab a letter, drag it, fling on release; a plain
  // click (no drag) plucks it instead.
  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: PointerEvent) => {
      const grab = grabRef.current;
      if (!grab) return;
      grab.targetX = e.clientX - grab.homeX;
      grab.targetY = e.clientY - grab.homeY;
      if (Math.hypot(e.clientX - grab.downX, e.clientY - grab.downY) > 6) grab.moved = true;
      const now = performance.now();
      trailRef.current.push({ x: e.clientX, y: e.clientY, t: now });
      while (trailRef.current.length > 2 && now - trailRef.current[0].t > 120) {
        trailRef.current.shift();
      }
    };
    const onUp = (e: PointerEvent) => {
      const grab = grabRef.current;
      if (!grab) return;
      grabRef.current = null;
      const states = statesRef.current;
      if (!states) return;
      const s = states[grab.index];
      if (!grab.moved) {
        // Plain click: pluck this letter (do not zero its state — the
        // pluck impulse needs to survive into the spring loop).
        if (pluckOnClick) pluck(grab.index, pluckStrength);
        return;
      }
      if (throwable && !reduceRef.current && s) {
        // Fling with the pointer's recent speed.
        const trail = trailRef.current;
        if (trail.length >= 2) {
          const a = trail[0];
          const b = trail[trail.length - 1];
          const dt = Math.max(1, b.t - a.t) / 1000;
          s.vx = clamp((b.x - a.x) / dt, -2600, 2600);
          s.vy = clamp((b.y - a.y) / dt, -2600, 2600);
        }
      } else if (s) {
        s.vx = 0;
        s.vy = 0;
      }
      ensureLoop();
      void e;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [interactive, pluckOnClick, pluckStrength, pluck, ensureLoop, renderFrame, throwable]);

  const onPointerDown = (index: number) => (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!interactive || e.button !== 0) return;
    const el = letterRefs.current[index];
    const root = rootRef.current;
    if (!el || !root) return;
    const r = el.getBoundingClientRect();
    const fontPx = parseFloat(window.getComputedStyle(root).fontSize || "64");
    fontPxRef.current = Number.isFinite(fontPx) && fontPx > 0 ? fontPx : 64;
    reachPxRef.current = reach * fontPxRef.current;
    grabRef.current = {
      index,
      homeX: r.x + r.width / 2,
      homeY: r.y + r.height / 2,
      targetX: 0,
      targetY: 0,
      moved: false,
      downX: e.clientX,
      downY: e.clientY,
    };
    trailRef.current = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
    ensureLoop();
    e.preventDefault();
  };

  const rootStyle: CSSProperties = {
    display: "inline-block",
    textAlign: align,
    fontSize: fontSize as CSSProperties["fontSize"],
    fontWeight,
    fontFamily,
    letterSpacing,
    lineHeight,
    color,
    cursor: interactive ? "grab" : undefined,
    ...style,
  };

  return (
    <span
      ref={rootRef}
      aria-label={text}
      data-elastic="root"
      className={className}
      style={rootStyle}
    >
      <span aria-hidden="true" style={{ display: "inline-block" }}>
        {letters.map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            data-elastic-letter={i}
            onPointerDown={onPointerDown(i)}
            style={{
              display: "inline-block",
              willChange: "transform",
              touchAction: "none",
              userSelect: "none",
              whiteSpace: "pre",
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
        {text}
      </span>
    </span>
  );
});

export default ElasticLettering;
