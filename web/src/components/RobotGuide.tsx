"use client";

/**
 * RobotGuide v5
 *
 * Default = peek (robot setengah tersembunyi di pojok kanan bawah)
 * Satu klik = langsung mulai tour — tidak ada bubble, tidak ada "Mulai Tour" button
 * Selama tour = robot tetap ada tapi kecil
 * Setelah tour = kembali ke peek
 *
 * Click target area dibesar (wrapper 64x64) agar mudah diklik di desktop & mobile
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/I18nProvider";

export type RobotMessage = {
  text: string;
  action?: "wave" | "point" | "nod" | "spin" | "celebrate";
};

/* ═══════════════════════════════════════════════
   Robot SVG
════════════════════════════════════════════════ */
export function RobotSVG({ action = "wave", size = 72 }: { action?: string; size?: number }) {
  const h = Math.round(size * 1.18);
  const isPoint = action === "point";
  const isCelebrate = action === "celebrate";
  const isWave = action === "wave";

  return (
    <svg width={size} height={h} viewBox="0 0 80 94" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Antenna */}
      <line x1="40" y1="0" x2="40" y2="11" stroke="#0d5c30" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="40" cy="0" r="3.5" fill="#f59e0b"/>
      <circle cx="40" cy="0" r="6" fill="#f59e0b" opacity="0.22"/>

      {/* Head */}
      <rect x="8" y="10" width="64" height="42" rx="16" fill="#1a7a4a"/>
      <rect x="14" y="14" width="52" height="9" rx="4.5" fill="white" opacity="0.07"/>

      {/* Eyes */}
      <ellipse cx="28" cy="30" rx="9" ry="8" fill="white" opacity="0.95"/>
      <ellipse cx="52" cy="30" rx="9" ry="8" fill="white" opacity="0.95"/>
      <circle cx={isPoint ? 31 : 28} cy={isPoint ? 28 : 30} r="4.5" fill="#0a2e1a"/>
      <circle cx={isPoint ? 55 : 52} cy={isPoint ? 28 : 30} r="4.5" fill="#0a2e1a"/>
      <circle cx={isPoint ? 33 : 30} cy={isPoint ? 26 : 28} r="1.6" fill="white"/>
      <circle cx={isPoint ? 57 : 54} cy={isPoint ? 26 : 28} r="1.6" fill="white"/>

      {/* Mouth */}
      {isCelebrate
        ? <path d="M27 42 Q40 54 53 42" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        : <path d="M27 41 Q40 50 53 41" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>}

      {/* Ear bolts */}
      <circle cx="7"  cy="31" r="5" fill="#155c38"/>
      <circle cx="73" cy="31" r="5" fill="#155c38"/>
      <circle cx="7"  cy="31" r="2.5" fill="#0d5c30"/>
      <circle cx="73" cy="31" r="2.5" fill="#0d5c30"/>

      {/* Body */}
      <rect x="12" y="56" width="56" height="34" rx="14" fill="#155c38"/>

      {/* Chest */}
      <rect x="24" y="63" width="32" height="20" rx="8" fill="#1a7a4a"/>
      <circle cx="40" cy="73" r="5.5" fill="#f59e0b"/>
      <circle cx="40" cy="73" r="8"   fill="#f59e0b" opacity="0.18"/>
      <circle cx="29" cy="78" r="2"   fill="#5ee89a" opacity="0.85"/>
      <circle cx="51" cy="78" r="2"   fill="#5ee89a" opacity="0.85"/>

      {/* Left arm — wave */}
      <g style={{
        transformOrigin: "9px 57px",
        animation: isWave ? "wave-arm 1.1s ease-in-out infinite" : "none",
      }}>
        <rect x="3"  y="57" width="10" height="24" rx="5" fill="#1a7a4a"/>
        <circle cx="8" cy="83" r="5" fill="#1a7a4a"/>
      </g>

      {/* Right arm — raised when pointing */}
      <g style={{
        transform: isPoint ? "rotate(-50deg)" : "none",
        transformOrigin: "71px 57px",
        transition: "transform 0.4s ease",
      }}>
        <rect x="67" y="57" width="10" height="24" rx="5" fill="#1a7a4a"/>
        <circle cx="72" cy="83" r="5" fill="#1a7a4a"/>
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   RobotGuide
════════════════════════════════════════════════ */
interface RobotGuideProps {
  message:            RobotMessage;
  visible?:           boolean;
  position?:          "bottom-right" | "bottom-left";
  onTutorialStart?:   () => void;
  showTutorialButton?: boolean;   // kept for compat — ignored
  autoStartKey?:      string;
  tourActive?:        boolean;
}

export function RobotGuide({
  message,
  visible = true,
  position = "bottom-right",
  onTutorialStart,
  autoStartKey,
  tourActive = false,
}: RobotGuideProps) {
  const { t } = useI18n();
  const isRight = position === "bottom-right";

  /* ── auto-start on first visit ── */
  useEffect(() => {
    if (!autoStartKey || !onTutorialStart) return;
    const key = `hc-tour:${autoStartKey}`;
    if (localStorage.getItem(key)) return;
    const timer = setTimeout(() => {
      localStorage.setItem(key, "1");
      onTutorialStart();
    }, 1200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStartKey]);

  if (!visible) return null;

  /* ── click handler ── */
  const handleClick = () => {
    if (!onTutorialStart) return;
    if (autoStartKey) localStorage.setItem(`hc-tour:${autoStartKey}`, "1");
    onTutorialStart();
  };

  /*
    Peek = robot translateY(64%) so roughly top 36% visible above bottom edge
    During tour = robot is smaller but fully visible (translateY 0)
    Transition is smooth spring
  */
  const peekY   = "66%";   // how much robot hides below edge
  const activeY = "0%";

  return (
    <div
      className={`fixed z-[499] ${isRight ? "right-3 sm:right-4" : "left-3 sm:left-4"}`}
      style={{ bottom: 0 }}
      aria-label="HalalBot"
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.5 }}
        className={`flex flex-col ${isRight ? "items-end" : "items-start"} gap-0`}
        style={{ paddingBottom: 4 }}
      >
        {/* Robot wrapper — translateY for peek */}
        <motion.div
          animate={{ translateY: tourActive ? activeY : peekY }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          {/*
            Large invisible hit area so robot is easy to click
            even when partially hidden
          */}
          <button
            onClick={handleClick}
            disabled={!onTutorialStart}
            aria-label={tourActive ? t("tourActiveLabel") : t("tourStartLabel")}
            style={{
              background: "none",
              border: "none",
              cursor: onTutorialStart ? "pointer" : "default",
              padding: 0,
              display: "block",
              /* Extra bottom padding so click target extends below visible area */
              paddingBottom: 28,
            }}
          >
            <motion.div
              whileHover={onTutorialStart ? { translateY: tourActive ? 0 : "-18%" } : {}}
              whileTap={onTutorialStart ? { scale: 0.93 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              {/* Card */}
              <div style={{
                background: "white",
                borderRadius: 20,
                border: tourActive
                  ? "2px solid rgba(26,122,74,0.35)"
                  : "1.5px solid rgba(26,122,74,0.18)",
                padding: tourActive ? "5px 8px 4px" : "8px 10px 6px",
                boxShadow: tourActive
                  ? "0 4px 18px rgba(26,122,74,0.20)"
                  : "0 10px 36px rgba(26,122,74,0.20), 0 2px 8px rgba(0,0,0,0.07)",
                position: "relative",
                userSelect: "none",
                transition: "border-color 0.3s, padding 0.3s, box-shadow 0.3s",
              }}>
                {/* Float animation */}
                <motion.div
                  animate={{ y: tourActive ? 0 : [0, -5, 0] }}
                  transition={
                    tourActive
                      ? { duration: 0.3 }
                      : { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }
                >
                  <span className="hidden sm:block">
                    <RobotSVG action={message.action} size={tourActive ? 50 : 64} />
                  </span>
                  <span className="sm:hidden">
                    <RobotSVG action={message.action} size={tourActive ? 40 : 52} />
                  </span>
                </motion.div>

                {/* Status dot */}
                <div style={{
                  position: "absolute",
                  top: -5, right: -5,
                  width: 13, height: 13,
                  borderRadius: "50%",
                  border: "2.5px solid white",
                  background: tourActive ? "#f59e0b" : "#22c55e",
                  transition: "background 0.4s",
                }} aria-hidden="true" />

                {/* Bottom badge */}
                <div style={{
                  position: "absolute",
                  bottom: tourActive ? -8 : -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: tourActive ? 18 : 22,
                  height: tourActive ? 18 : 22,
                  borderRadius: "50%",
                  background: "#1a7a4a",
                  boxShadow: "0 2px 7px rgba(26,122,74,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "width 0.3s, height 0.3s, bottom 0.3s",
                }} aria-hidden="true">
                  {tourActive ? (
                    /* pause icon — touring */
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <rect x="1" y="1" width="2" height="6" rx="0.8" fill="white"/>
                      <rect x="5" y="1" width="2" height="6" rx="0.8" fill="white"/>
                    </svg>
                  ) : (
                    /* play icon — click to start */
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M2 1.5l5 2.5-5 2.5V1.5z" fill="white"/>
                    </svg>
                  )}
                </div>
              </div>
            </motion.div>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Inline hint (inside forms)
════════════════════════════════════════════════ */
export function InlineRobotHint({
  message, step, totalSteps,
}: { message: string; step: number; totalSteps: number }) {
  return (
    <motion.div
      key={`hint-${step}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-3 rounded-xl p-3"
      style={{ background: "rgba(26,122,74,0.05)", border: "1px solid rgba(26,122,74,0.12)" }}
    >
      <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: "#1a7a4a" }} aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="3" y="6" width="12" height="9" rx="3.5" fill="white" opacity="0.9"/>
          <circle cx="6.5" cy="10" r="1.6" fill="#1a7a4a"/>
          <circle cx="11.5" cy="10" r="1.6" fill="#1a7a4a"/>
          <line x1="9" y1="2" x2="9" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="9" cy="1.5" r="1.2" fill="#f59e0b"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold mb-0.5" style={{ color: "#1a7a4a" }}>
          Langkah {step}/{totalSteps}
        </p>
        <p className="text-[13px] leading-relaxed" style={{ color: "#1a4a2e" }}>{message}</p>
      </div>
    </motion.div>
  );
}
