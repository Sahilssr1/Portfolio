"use client";

/**
 * GravityLetters — an original glyph-sand headline, written for this site.
 *
 * The headline is sampled into tiny glyph grains on a canvas. At rest the
 * grains sit in place and read as solid letters. Drag through the letters
 * to slice them: grains on the blade spray off, and anything below a cut
 * loses its support and crumbles. Click to collapse the whole headline —
 * it tumbles down as pieces, bursts into sand, rests, then pours back
 * into place. Loose grains rest a moment, then fly home on their own.
 *
 * Behaviour mirrors the public description of React Bits Pro's "Gravity
 * Letters" (props table on pro.reactbits.dev), but every line of this
 * implementation is original — the Pro source is paywalled and was not
 * used. No physics library; plain canvas + requestAnimationFrame.
 */

import {
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type Ref,
} from "react";

export interface GravityLettersHandle {
  /** Crumble the headline from a point (fractions of width/height, 0..1). */
  collapse: (x?: number, y?: number) => void;
  /** Bring all sand home, in rebuild order. */
  rebuild: () => void;
}

export type GravityLettersGrain = "glyph" | "dot" | "square";
export type GravityLettersAnchor = "top" | "bottom";
export type GravityLettersRebuild = "sweep" | "rise" | "random";

interface GravityLettersProps {
  text: string;
  /** Largest font size in px; the text shrinks to fit the container width. */
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  lineHeight?: number;
  /** [colour of grains standing in the letters, colour they turn as sand] */
  colors?: [string, string];
  highlightWords?: string[];
  highlightColor?: string;
  grain?: GravityLettersGrain;
  charset?: string;
  /** Size of each grain cell in px. Smaller = finer letters, softer pour. */
  grainSize?: number;
  grainScale?: number;
  /** Strength of gravity, 0.1 (drifting) to 4 (heavy). */
  gravity?: number;
  /** Where each letter is held: hang from the top edge, or stand on the baseline. */
  anchor?: GravityLettersAnchor;
  /** Swiping the pointer through the letters slices them. */
  cut?: boolean;
  cutWidth?: number;
  throwForce?: number;
  /** Clicking knocks every letter loose, spreading out from the click. */
  clickToCollapse?: boolean;
  /** Speed the collapse spreads from the click, in px per second. */
  collapseSpeed?: number;
  /** Grains that weather off exposed edges on their own, 0 (none) to 1. */
  erosion?: number;
  /** Seconds a loose grain rests before it returns home. */
  healDelay?: number;
  /** Seconds the collapsed sand rests before the headline rebuilds. */
  holdTime?: number;
  /** Order the sand returns in: left to right, top of the pile first, or random. */
  rebuild?: GravityLettersRebuild;
  /** Seconds each grain takes to fly home. */
  rebuildDuration?: number;
  /** Collapse once when the headline first scrolls into view. */
  collapseOnView?: boolean;
  /** Freeze the sand (reduced-motion users always get the still headline). */
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*@!?<>/\\=+~^█▓▒░";

type GrainState = "home" | "loose" | "returning";

interface Grain {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ch: string;
  state: GrainState;
  color: string;
  word: number;
  /** Timestamp (ms) when a support-loss fall should start; 0 = none. */
  looseAt: number;
  restSince: number | null;
  retStart: number;
  retFromX: number;
  retFromY: number;
  retDur: number;
  fallAt: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function GravityLetters({
  ref,
  text,
  fontSize = 200,
  fontWeight = 800,
  fontFamily = "inherit",
  lineHeight = 1,
  colors = ["#ffffff", "#b19eef"],
  highlightWords = [],
  highlightColor,
  grain = "glyph",
  charset = DEFAULT_CHARSET,
  grainSize = 7,
  grainScale = 1,
  gravity = 1,
  anchor = "top",
  cut = true,
  cutWidth = 10,
  throwForce = 1,
  clickToCollapse = true,
  collapseSpeed = 1400,
  erosion = 0.1,
  healDelay = 1.8,
  holdTime = 0.8,
  rebuild = "sweep",
  rebuildDuration = 0.7,
  collapseOnView = false,
  paused = false,
  className = "",
  style,
}: GravityLettersProps & { ref?: Ref<GravityLettersHandle> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef({
    gravity,
    cut,
    cutWidth,
    throwForce,
    clickToCollapse,
    collapseSpeed,
    erosion,
    healDelay,
    holdTime,
    rebuild,
    rebuildDuration,
    paused,
    anchor,
    colors,
    grain,
    grainSize,
    grainScale,
    charset,
    highlightWords,
    highlightColor,
  });
  propsRef.current = {
    gravity,
    cut,
    cutWidth,
    throwForce,
    clickToCollapse,
    collapseSpeed,
    erosion,
    healDelay,
    holdTime,
    rebuild,
    rebuildDuration,
    paused,
    anchor,
    colors,
    grain,
    grainSize,
    grainScale,
    charset,
    highlightWords,
    highlightColor,
  };

  useImperativeHandle(ref, () => ({
    collapse: (x = 0.5, y = 0.3) => apiRef.current?.collapse(x, y),
    rebuild: () => apiRef.current?.rebuild(),
  }));

  const apiRef = useRef<{ collapse: (x: number, y: number) => void; rebuild: () => void } | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let grains: Grain[] = [];
    /** Every cell that belongs to the letters, "col,row" — the static layout. */
    let layoutCells = new Set<string>();
    /** Word layout for the solid underlay (see draw): fitted font, top pad, spans. */
    let layoutInfo: {
      font: string;
      pad: number;
      words: { word: string; x: number; w: number; total: number; highlight: boolean; index: number }[];
    } | null = null;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let destroyed = false;
    let built = false;
    let collapseTimer = 0;
    let frameCount = 0;
    let collapsedOnce = false;
    let viewObserver: IntersectionObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;
    const cell = () => propsRef.current.grainSize;
    const sandColor = () => propsRef.current.colors[1];

    const key = (col: number, row: number) => `${col},${row}`;

    /** Draw the text on an offscreen canvas and sample it into grains. */
    const build = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      if (w < 10 || h < 10) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = w;
      H = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // Fit the font to the box width (single line; shrink only).
      const measure = document.createElement("canvas").getContext("2d");
      if (!measure) return;
      let px = fontSize;
      const setFont = (size: number) =>
        `${fontWeight} ${size}px ${fontFamily}, sans-serif`;
      measure.font = setFont(px);
      const textW = measure.measureText(text).width;
      if (textW > 0) px = Math.min(px, (px * (w - 4)) / textW);
      px = Math.max(8, px);

      // Layout words left to right so highlight words can be tagged.
      const off = document.createElement("canvas");
      off.width = Math.max(2, Math.round(w));
      off.height = Math.max(2, Math.round(h));
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.font = setFont(px);
      octx.textAlign = "left";
      octx.textBaseline = "top";
      const pad = cell();
      const words = text.split(/\s+/).filter(Boolean);
      const spaceW = measure.measureText(" ").width;
      const wordWidths = words.map((word) => measure.measureText(word).width);
      const lineW =
        wordWidths.reduce((sum, ww) => sum + ww, 0) + spaceW * Math.max(0, words.length - 1);
      // Center the line inside the box; sampling below uses these same x positions.
      let x = Math.max(pad, (w - lineW) / 2);
      const wordSpans: { word: string; x: number; w: number }[] = [];
      words.forEach((word, i) => {
        const ww = wordWidths[i];
        wordSpans.push({ word, x, w: ww });
        octx.fillText(word, x, pad);
        x += ww + spaceW;
      });

      const img = octx.getImageData(0, 0, off.width, off.height).data;
      const next: Grain[] = [];
      const cells = new Set<string>();
      const cs = cell();
      const isHighlight = (word: string) =>
        propsRef.current.highlightWords.some((entry) => entry && word.startsWith(entry));
      wordSpans.forEach((span, wordIndex) => {
        const col0 = Math.floor(span.x / cs);
        const col1 = Math.ceil((span.x + span.w) / cs);
        const row0 = 0;
        const row1 = Math.ceil(h / cs);
        for (let row = row0; row < row1; row++) {
          for (let col = col0; col <= col1; col++) {
            const pxX = Math.floor(col * cs + cs / 2);
            const pxY = Math.floor(row * cs + cs / 2);
            if (pxX < 0 || pxY < 0 || pxX >= off.width || pxY >= off.height) continue;
            const alpha = img[(pxY * off.width + pxX) * 4 + 3];
            if (alpha < 70) continue;
            const gx = col * cs + cs / 2;
            const gy = row * cs + cs / 2;
            cells.add(key(col, row));
            next.push({
              hx: gx,
              hy: gy,
              x: gx,
              y: gy,
              vx: 0,
              vy: 0,
              ch: charset[Math.floor(Math.random() * charset.length)] ?? "#",
              state: "home",
              color: isHighlight(span.word)
                ? (propsRef.current.highlightColor ?? propsRef.current.colors[0])
                : propsRef.current.colors[0],
              word: wordIndex,
              looseAt: 0,
              restSince: null,
              retStart: 0,
              retFromX: gx,
              retFromY: gy,
              retDur: 700,
              fallAt: 0,
            });
          }
        }
      });
      grains = next;
      layoutCells = cells;
      layoutInfo = {
        font: setFont(px),
        pad,
        words: wordSpans.map((span, i) => ({
          word: span.word,
          x: span.x,
          w: span.w,
          total: next.filter((g) => g.word === i).length,
          highlight: isHighlight(span.word),
          index: i,
        })),
      };
      built = true;
      draw(performance.now());
    };

    const loosen = (g: Grain, vx: number, vy: number) => {
      if (g.state !== "home") return;
      g.state = "loose";
      g.vx = vx;
      g.vy = vy;
      g.looseAt = 0;
      g.restSince = null;
    };

    const startReturn = (g: Grain, delayMs: number) => {
      if (g.state === "returning") return;
      g.state = "returning";
      g.retStart = performance.now() + delayMs;
      g.retFromX = g.x;
      g.retFromY = g.y;
      g.retDur = propsRef.current.rebuildDuration * 1000;
    };

    const rebuildAll = () => {
      const p = propsRef.current;
      const ordered = [...grains].sort((a, b) => {
        if (p.rebuild === "rise") return a.hy - b.hy;
        if (p.rebuild === "random") return Math.random() - 0.5;
        return a.hx - b.hx; // sweep: left to right
      });
      const n = Math.max(1, ordered.length);
      ordered.forEach((g, i) => {
        if (g.state === "home") return;
        startReturn(g, (i / n) * 600);
      });
    };

    const collapse = (fx: number, fy: number) => {
      const p = propsRef.current;
      const ox = fx * W;
      const oy = fy * H;
      const now = performance.now();
      grains.forEach((g) => {
        if (g.state !== "home") return;
        const dist = Math.hypot(g.hx - ox, g.hy - oy);
        g.fallAt = now + (dist / p.collapseSpeed) * 1000;
      });
      window.clearTimeout(collapseTimer);
      collapseTimer = window.setTimeout(() => {
        rebuildAll();
      }, p.holdTime * 1000 + 900);
    };

    apiRef.current = { collapse, rebuild: rebuildAll };

    /** Home grains lose support when the grains above them are gone. */
    const supportCheck = (now: number) => {
      const p = propsRef.current;
      const dir = p.anchor === "bottom" ? 1 : -1;
      const homeCells = new Set<string>();
      for (const g of grains) if (g.state === "home") homeCells.add(keyFor(g));
      for (const g of grains) {
        if (g.state !== "home" || g.looseAt) continue;
        const col = Math.floor(g.hx / cell());
        const row = Math.floor(g.hy / cell());
        const above = [col - 1, col, col + 1].map((c) => key(c, row + dir));
        const anyHome = above.some((k) => homeCells.has(k));
        if (anyHome) continue;
        const anyLayout = above.some((k) => layoutCells.has(k));
        if (!anyLayout) continue; // top/bottom edge: this grain IS the anchor
        g.looseAt = now + rand(0, 150);
      }
    };

    const keyFor = (g: Grain) =>
      key(Math.floor(g.hx / cell()), Math.floor(g.hy / cell()));

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const p = propsRef.current;
      const gs = cell() * p.grainScale;
      // Solid underlay: the headline must read as text at a glance, not just
      // as texture. It is drawn per word and fades exactly as that word's
      // sand leaves — so a collapse still reads as the letters dissolving.
      if (layoutInfo) {
        ctx.save();
        ctx.font = layoutInfo.font;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        for (const wi of layoutInfo.words) {
          if (!wi.total) continue;
          let home = 0;
          for (const g of grains) if (g.word === wi.index && g.state === "home") home++;
          const a = (home / wi.total) * 0.32;
          if (a < 0.01) continue;
          ctx.globalAlpha = a;
          ctx.fillStyle = wi.highlight
            ? (propsRef.current.highlightColor ?? p.colors[0])
            : p.colors[0];
          ctx.fillText(wi.word, wi.x, layoutInfo.pad);
        }
        ctx.restore();
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (p.grain === "glyph") ctx.font = `900 ${Math.max(4, gs)}px ui-monospace, monospace`;
      for (const g of grains) {
        ctx.fillStyle = g.state === "home" ? g.color : sandColor();
        if (p.grain === "dot") {
          ctx.beginPath();
          ctx.arc(g.x, g.y, Math.max(1, gs / 2.4), 0, Math.PI * 2);
          ctx.fill();
        } else if (p.grain === "square") {
          ctx.fillRect(g.x - gs / 2, g.y - gs / 2, gs, gs);
        } else {
          ctx.fillText(g.ch, g.x, g.y);
        }
      }
      void now;
    };

    const frame = (now: number) => {
      if (destroyed) return;
      raf = requestAnimationFrame(frame);
      const p = propsRef.current;
      if (p.paused || reduced) {
        draw(now);
        return;
      }
      frameCount++;
      const g = p.gravity * 0.55; // px per frame^2 at 60fps
      const floor = H - cell() / 2;
      const r = cell() / 2;

      // Collapse stagger: grains fall when their time comes.
      for (const grain of grains) {
        if (grain.state === "home" && grain.fallAt && now >= grain.fallAt) {
          grain.fallAt = 0;
          const dx = grain.hx - W / 2;
          const dy = grain.hy - H / 2;
          const len = Math.hypot(dx, dy) || 1;
          loosen(grain, (dx / len) * rand(2, 5), (dy / len) * rand(2, 5) - 2.5);
        }
        if (grain.state === "home" && grain.looseAt && now >= grain.looseAt) {
          loosen(grain, rand(-0.6, 0.6), rand(0, 0.8));
        }
      }

      // Erosion: a grain weathers off an exposed edge now and then.
      if (p.erosion > 0 && Math.random() < p.erosion * 0.0016) {
        const candidates = grains.filter((gr) => gr.state === "home");
        const gr = candidates[Math.floor(Math.random() * candidates.length)];
        if (gr) loosen(gr, rand(-0.4, 0.4), rand(0.2, 0.7));
      }

      if (frameCount % 4 === 0) supportCheck(now);

      for (const grain of grains) {
        if (grain.state === "loose") {
          grain.vy += g;
          grain.vy = Math.min(grain.vy, 22);
          grain.vx *= 0.995;
          grain.x += grain.vx;
          grain.y += grain.vy;
          if (grain.y > floor) {
            grain.y = floor;
            grain.vy = Math.abs(grain.vy) > 1.2 ? -grain.vy * 0.32 : 0;
            grain.vx *= 0.72;
          }
          if (grain.x < r) {
            grain.x = r;
            grain.vx = Math.abs(grain.vx) * 0.4;
          } else if (grain.x > W - r) {
            grain.x = W - r;
            grain.vx = -Math.abs(grain.vx) * 0.4;
          }
          if (grain.y < r) {
            grain.y = r;
            grain.vy = Math.abs(grain.vy) * 0.4;
          }
          const speed = Math.hypot(grain.vx, grain.vy);
          if (speed < 0.35 && grain.y >= floor - 0.5) {
            grain.restSince ??= now;
            if (now - grain.restSince > p.healDelay * 1000) {
              grain.restSince = null;
              startReturn(grain, 0);
            }
          } else {
            grain.restSince = null;
          }
        } else if (grain.state === "returning") {
          if (now < grain.retStart) continue;
          const t = clamp((now - grain.retStart) / grain.retDur, 0, 1);
          const e = easeOutCubic(t);
          grain.x = grain.retFromX + (grain.hx - grain.retFromX) * e;
          grain.y = grain.retFromY + (grain.hy - grain.retFromY) * e;
          if (t >= 1) {
            grain.state = "home";
            grain.x = grain.hx;
            grain.y = grain.hy;
            grain.vx = 0;
            grain.vy = 0;
          }
        }
      }
      draw(now);
    };

    const distToSegment = (
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len2 = dx * dx + dy * dy || 1;
      let t = ((px - x1) * dx + (py - y1) * dy) / len2;
      t = clamp(t, 0, 1);
      return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
    };

    let slicing = false;
    let lastX = 0;
    let lastY = 0;
    let downX = 0;
    let downY = 0;
    let downAt = 0;

    const local = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      return { x: e.clientX - box.left, y: e.clientY - box.top };
    };

    const sliceSegment = (x1: number, y1: number, x2: number, y2: number) => {
      const p = propsRef.current;
      const half = p.cutWidth / 2;
      const dirX = x2 - x1;
      const dirY = y2 - y1;
      const len = Math.hypot(dirX, dirY) || 1;
      for (const grain of grains) {
        if (grain.state !== "home") continue;
        if (distToSegment(grain.x, grain.y, x1, y1, x2, y2) > half + cell() / 2) continue;
        loosen(
          grain,
          (dirX / len) * p.throwForce * rand(3, 6) + rand(-1, 1),
          (dirY / len) * p.throwForce * rand(3, 6) + rand(1, 3),
        );
      }
    };

    const onDown = (e: PointerEvent) => {
      const pt = local(e);
      slicing = true;
      lastX = pt.x;
      lastY = pt.y;
      downX = pt.x;
      downY = pt.y;
      downAt = performance.now();
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!slicing || !propsRef.current.cut) return;
      const pt = local(e);
      sliceSegment(lastX, lastY, pt.x, pt.y);
      lastX = pt.x;
      lastY = pt.y;
    };
    const onUp = (e: PointerEvent) => {
      const wasSlicing = slicing;
      slicing = false;
      if (!wasSlicing) return;
      const pt = local(e);
      const moved = Math.hypot(pt.x - downX, pt.y - downY);
      const quick = performance.now() - downAt < 400;
      if (propsRef.current.clickToCollapse && moved < 6 && quick) {
        collapse(pt.x / W, pt.y / H);
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    if (collapseOnView) {
      viewObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          if (entry.isIntersecting && !collapsedOnce && built) {
            collapsedOnce = true;
            collapse(0.5, 0.25);
            viewObserver?.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      viewObserver.observe(root);
    }

    const doBuild = () => {
      if (destroyed) return;
      build();
      if (!built) return;
      raf = requestAnimationFrame(frame);
    };

    // Wait for the display font so the sampled shapes match the real letters.
    let fontTimer = 0;
    const fontsReady =
      typeof document !== "undefined" && document.fonts?.ready
        ? document.fonts.ready
        : Promise.resolve();
    fontsReady.then(() => {
      if (!destroyed) doBuild();
    });
    fontTimer = window.setTimeout(() => {
      if (!destroyed && !built) doBuild();
    }, 1500);

    let resizeTimer = 0;
    resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (destroyed) return;
        cancelAnimationFrame(raf);
        build();
        if (built) raf = requestAnimationFrame(frame);
      }, 150);
    });
    resizeObserver.observe(root);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(collapseTimer);
      window.clearTimeout(fontTimer);
      window.clearTimeout(resizeTimer);
      viewObserver?.disconnect();
      resizeObserver?.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      apiRef.current = null;
    };
    // Re-sample only when the sampled shape itself changes. Highlight words
    // are read through propsRef so a new array literal doesn't rebuild.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, fontSize, fontWeight, fontFamily, grainSize, grain, charset, collapseOnView]);

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={text}
      className={`relative inline-block touch-none select-none ${className}`}
      style={style}
    >
      <span className="sr-only">{text}</span>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
