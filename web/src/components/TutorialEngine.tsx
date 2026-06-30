"use client";

/**
 * TutorialEngine v4 — correct approach
 *
 * Key insight: getBoundingClientRect gives viewport-relative coords.
 * We use position:fixed for all overlays so it always matches.
 *
 * The ONLY correct sequence is:
 * 1. Scroll element into view (instant, no animation) BEFORE locking scroll
 * 2. Lock scroll (overflow:hidden + save scroll position)
 * 3. Measure element AFTER layout paint via rAF
 * 4. Render spotlight + tooltip at those fixed coords
 *
 * On step change: unlock scroll → scroll new target into view → lock again → measure
 */

import {
  useEffect, useRef, useState, useCallback,
  createContext, useContext,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/I18nProvider";

/* ─── Types ──────────────────────────────────── */
export type TutorialStep = {
  target: string;
  title: string;
  body: string;
  placement?: "top" | "bottom" | "left" | "right" | "center";
  action?: "wave" | "point" | "nod" | "celebrate";
};

type Rect = { top: number; left: number; width: number; height: number };

type TutorialCtx = {
  start: (steps: TutorialStep[]) => void;
  stop: () => void;
  isActive: boolean;
};

const Ctx = createContext<TutorialCtx>({ start: () => {}, stop: () => {}, isActive: false });
export const useTutorial = () => useContext(Ctx);

/* ─── Scroll lock helpers ────────────────────── */
let savedScrollY = 0;

function lockScroll() {
  savedScrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.width = "100%";
  document.body.style.overflowY = "scroll"; // keep scrollbar width
}

function unlockScroll() {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.overflowY = "";
  window.scrollTo({ top: savedScrollY, behavior: "instant" as ScrollBehavior });
}

/* ─── Measure element ────────────────────────── */
function measureEl(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

/* ─── Spotlight ──────────────────────────────── */
function Spotlight({ rect }: { rect: Rect }) {
  const PAD = 10;
  const x = rect.left - PAD;
  const y = rect.top - PAD;
  const w = rect.width + PAD * 2;
  const h = rect.height + PAD * 2;
  const rx = 12;

  return (
    <svg
      style={{
        position: "fixed", inset: 0, zIndex: 498,
        width: "100vw", height: "100vh",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <defs>
        <mask id="hc-spotlight-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect x={x} y={y} width={w} height={h} rx={rx} fill="black" />
        </mask>
      </defs>
      {/* Dark overlay */}
      <rect width="100%" height="100%"
        fill="rgba(5,15,9,0.80)"
        mask="url(#hc-spotlight-mask)"
      />
      {/* Highlight ring */}
      <rect x={x} y={y} width={w} height={h} rx={rx}
        fill="none" stroke="#22c55e" strokeWidth="2.5" strokeOpacity="0.75"
      />
      {/* Outer glow ring */}
      <rect x={x - 5} y={y - 5} width={w + 10} height={h + 10} rx={rx + 3}
        fill="none" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.18"
      />
    </svg>
  );
}

/* ─── Arrow (points from tooltip toward element) */
function Arrow({ rect, placement }: { rect: Rect; placement?: TutorialStep["placement"] }) {
  const { top, left, width, height } = rect;
  const p = placement ?? "bottom";

  // Arrow position: between element and tooltip
  // rot 0 = triangle points UP (for placement "bottom" — tooltip is below element, arrow points up at it)
  const positions: Record<string, { x: number; y: number; rot: number }> = {
    bottom: { x: left + width / 2,     y: top + height + 6,   rot: 0 },
    top:    { x: left + width / 2,     y: top - 6,            rot: 180 },
    right:  { x: left + width + 6,     y: top + height / 2,   rot: -90 },
    left:   { x: left - 6,             y: top + height / 2,   rot: 90 },
    center: { x: left + width / 2,     y: top + height + 6,   rot: 0 },
  };
  const pos = positions[p] ?? positions.bottom;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: pos.x - 10, top: pos.y - 6,
        zIndex: 500, pointerEvents: "none",
        width: 20, height: 14,
      }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <svg width="20" height="14" viewBox="0 0 20 14" fill="none"
        style={{ display: "block", transform: `rotate(${pos.rot}deg)` }}>
        {/* Arrow head pointing UP (toward element when placement=bottom) */}
        <path d="M10 1 L19 13 H1 Z"
          fill="#22c55e" stroke="rgba(255,255,255,0.30)" strokeWidth="0.8" />
      </svg>
    </motion.div>
  );
}

/* ─── Mini robot for tooltip ─────────────────── */
function MiniBot({ action }: { action?: string }) {
  const isPoint = action === "point";
  const isCelebrate = action === "celebrate";
  return (
    <svg width="36" height="42" viewBox="0 0 80 94" fill="none" aria-hidden="true">
      <line x1="40" y1="0" x2="40" y2="11" stroke="#0d5c30" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="40" cy="0" r="5" fill="#f59e0b"/>
      <rect x="8" y="10" width="64" height="42" rx="16" fill="#1a7a4a"/>
      <ellipse cx="28" cy="30" rx="9" ry="8" fill="white" opacity="0.95"/>
      <ellipse cx="52" cy="30" rx="9" ry="8" fill="white" opacity="0.95"/>
      <circle cx={isPoint ? 32 : 28} cy={isPoint ? 27 : 30} r="5" fill="#0a2e1a"/>
      <circle cx={isPoint ? 56 : 52} cy={isPoint ? 27 : 30} r="5" fill="#0a2e1a"/>
      <circle cx={isPoint ? 34 : 30} cy={isPoint ? 25 : 28} r="1.8" fill="white"/>
      <circle cx={isPoint ? 58 : 54} cy={isPoint ? 25 : 28} r="1.8" fill="white"/>
      {isCelebrate
        ? <path d="M26 42 Q40 55 54 42" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
        : <path d="M26 41 Q40 51 54 41" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>}
      <circle cx="7"  cy="31" r="6" fill="#155c38"/>
      <circle cx="73" cy="31" r="6" fill="#155c38"/>
      <rect x="12" y="56" width="56" height="34" rx="14" fill="#155c38"/>
      <rect x="24" y="63" width="32" height="20" rx="8" fill="#1a7a4a"/>
      <circle cx="40" cy="73" r="6" fill="#f59e0b"/>
      <rect x="3"  y="57" width="10" height="24" rx="5" fill="#1a7a4a"/>
      <rect x="67" y="57" width="10" height="24" rx="5" fill="#1a7a4a"/>
    </svg>
  );
}

/* ─── Tooltip card ───────────────────────────── */
function TooltipCard({
  step, idx, total, rect, onNext, onPrev, onSkip,
}: {
  step: TutorialStep; idx: number; total: number; rect: Rect;
  onNext(): void; onPrev(): void; onSkip(): void;
}) {
  const { t } = useI18n();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const W = Math.min(288, vw - 24);
  const H_EST = 190; // estimated height for clamping
  const GAP = 14;    // gap between element edge and tooltip
  const ARROW = 18;  // arrow height

  const p = step.placement ?? "bottom";

  let px: number, py: number;
  const cx = rect.left + rect.width / 2;

  switch (p) {
    case "bottom":
      px = cx - W / 2;
      py = rect.top + rect.height + GAP + ARROW;
      break;
    case "top":
      px = cx - W / 2;
      py = rect.top - H_EST - GAP - ARROW;
      break;
    case "right":
      px = rect.left + rect.width + GAP + ARROW;
      py = rect.top + rect.height / 2 - H_EST / 2;
      break;
    case "left":
      px = rect.left - W - GAP - ARROW;
      py = rect.top + rect.height / 2 - H_EST / 2;
      break;
    default: // center
      px = vw / 2 - W / 2;
      py = vh / 2 - H_EST / 2;
  }

  // Clamp to viewport with margin
  px = Math.max(10, Math.min(px, vw - W - 10));
  py = Math.max(10, Math.min(py, vh - H_EST - 10));

  return (
    <motion.div
      key={`tc-${idx}`}
      initial={{ opacity: 0, scale: 0.90, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.90, y: -6 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      style={{
        position: "fixed", left: px, top: py, width: W, zIndex: 502,
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${t("tourStep")} ${idx + 1} ${t("tourOf")} ${total}`}
    >
      <div style={{
        background: "white",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(4,14,8,0.32), 0 4px 16px rgba(4,14,8,0.16)",
        border: "1.5px solid rgba(26,122,74,0.14)",
      }}>
        {/* Top bar */}
        <div style={{ height: 3, background: "linear-gradient(90deg,#1a7a4a,#22c55e)" }} />

        <div style={{ padding: "12px 14px 14px" }}>
          {/* Header row */}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{
              flexShrink: 0,
              background: "rgba(26,122,74,0.07)",
              borderRadius: 12, padding: 5,
            }}>
              <MiniBot action={step.action} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0a2e1a", letterSpacing: "-0.01em" }}>
                  {step.title}
                </span>
                <span style={{
                  flexShrink: 0, fontSize: 10, fontWeight: 600,
                  padding: "2px 8px", borderRadius: 99,
                  background: "rgba(26,122,74,0.10)", color: "#1a7a4a",
                }}>
                  {idx + 1}/{total}
                </span>
              </div>
              <p style={{ marginTop: 4, fontSize: 12, lineHeight: 1.55, color: "#3a6048" }}>
                {step.body}
              </p>
            </div>
          </div>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                height: 4, borderRadius: 99,
                width: i === idx ? 20 : 4,
                background: i <= idx ? "#1a7a4a" : "rgba(26,122,74,0.15)",
                transition: "width 0.28s, background 0.28s",
              }} />
            ))}
          </div>

          {/* Action row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={onSkip}
              style={{
                fontSize: 11, cursor: "pointer", background: "none", border: "none",
                padding: "4px 0", color: "rgba(26,122,74,0.40)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1a7a4a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(26,122,74,0.40)")}>
              {t("tourSkip")}
            </button>
            <div style={{ display: "flex", gap: 6 }}>
              {idx > 0 && (
                <button
                  onClick={onPrev}
                  style={{
                    display: "flex", alignItems: "center", gap: 3, fontSize: 11,
                    cursor: "pointer", padding: "5px 11px", borderRadius: 99,
                    background: "white", border: "1px solid rgba(26,122,74,0.22)", color: "#1a7a4a",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,122,74,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {t("tourBack")}
                </button>
              )}
              <button
                onClick={onNext}
                style={{
                  display: "flex", alignItems: "center", gap: 4, fontSize: 11,
                  cursor: "pointer", padding: "5px 13px", borderRadius: 99,
                  background: "#1a7a4a", color: "white", border: "none",
                  boxShadow: "0 2px 8px rgba(26,122,74,0.42)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#155c38")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1a7a4a")}>
                {idx < total - 1 ? (
                  <>{t("tourNext")} <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M3 1l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg></>
                ) : (
                  <>{t("tourDone")} <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <polyline points="1 5 4 8 9 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Keyboard hint ──────────────────────────── */
function KeyboardHint() {
  const { t } = useI18n();
  return (
    <div
      style={{
        position: "fixed", bottom: 8, left: "50%", transform: "translateX(-50%)",
        zIndex: 503, display: "flex", alignItems: "center", gap: 4,
        fontSize: 10, color: "rgba(255,255,255,0.35)", pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
      aria-hidden="true"
    >
      {["←", "→", t("tourNav"), "·", "Esc", t("tourClose")].map((k, i) =>
        k === "·" || k === t("tourNav") || k === t("tourClose")
          ? <span key={i}>{k}</span>
          : <kbd key={i} style={{
              padding: "1px 5px", borderRadius: 4,
              background: "rgba(255,255,255,0.10)", fontFamily: "monospace",
            }}>{k}</kbd>
      )}
    </div>
  );
}

/* ─── Overlay ────────────────────────────────── */
function Overlay({ steps, onDone }: { steps: TutorialStep[]; onDone(): void }) {
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const idxRef = useRef(0);
  idxRef.current = idx;

  /* Navigate to a step:
     1. unlock scroll
     2. instant-scroll element into view
     3. lock scroll
     4. measure element in next rAF (after paint)
  */
  const goTo = useCallback((stepIdx: number) => {
    const step = steps[stepIdx];
    if (!step) { onDone(); return; }

    const el = document.querySelector<HTMLElement>(step.target);
    if (!el) {
      // element not in DOM — skip
      const next = stepIdx + 1;
      if (next < steps.length) goTo(next);
      else onDone();
      return;
    }

    // Step 1: clear current rect so old highlight disappears
    setRect(null);
    setIdx(stepIdx);

    // Step 2: unlock scroll temporarily, scroll element to center, relock
    unlockScroll();

    // Instant scroll (no animation) so we can immediately measure
    el.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior });

    // Step 3: lock scroll at new position
    lockScroll();

    // Step 4: measure after browser has painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      });
    });
  }, [steps, onDone]);

  // Lock scroll on mount, unlock on unmount
  useEffect(() => {
    goTo(0);
    return () => unlockScroll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-measure on window resize
  useEffect(() => {
    const onResize = () => {
      const step = steps[idxRef.current];
      if (!step) return;
      const el = document.querySelector<HTMLElement>(step.target);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [steps]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") {
        const n = idxRef.current + 1;
        if (n < steps.length) goTo(n); else onDone();
      } else if (e.key === "ArrowLeft") {
        if (idxRef.current > 0) goTo(idxRef.current - 1);
      } else if (e.key === "Escape") {
        onDone();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steps, onDone, goTo]);

  const next = () => { const n = idxRef.current + 1; if (n < steps.length) goTo(n); else onDone(); };
  const prev = () => { if (idxRef.current > 0) goTo(idxRef.current - 1); };

  const step = steps[idx];
  if (!rect || !step) return null; // don't render until rect is ready

  return createPortal(
    <>
      {/* Backdrop — clicking it skips the tour */}
      <div
        style={{ position: "fixed", inset: 0, zIndex: 497, cursor: "default" }}
        onClick={onDone}
      />

      <Spotlight rect={rect} />
      {step.placement !== "center" && <Arrow rect={rect} placement={step.placement} />}

      <AnimatePresence mode="wait">
        <TooltipCard
          key={`step-${idx}`}
          step={step} idx={idx} total={steps.length}
          rect={rect} onNext={next} onPrev={prev} onSkip={onDone}
        />
      </AnimatePresence>

      {/* Keyboard hint at bottom */}
      <KeyboardHint />
    </>,
    document.body,
  );
}

/* ─── Provider ───────────────────────────────── */
export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<TutorialStep[] | null>(null);
  const start = useCallback((s: TutorialStep[]) => setSteps(s), []);
  const stop  = useCallback(() => { setSteps(null); }, []);

  return (
    <Ctx.Provider value={{ start, stop, isActive: !!steps }}>
      {children}
      <AnimatePresence>
        {steps && <Overlay key="tour-overlay" steps={steps} onDone={stop} />}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
