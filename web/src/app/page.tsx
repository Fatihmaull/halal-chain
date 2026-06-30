"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { AppHeader, Reveal } from "@/components/ui";
import { RobotGuide } from "@/components/RobotGuide";
import { useTutorial } from "@/components/TutorialEngine";
import { useI18n } from "@/lib/I18nProvider";
import type { RobotMessage } from "@/components/RobotGuide";
import type { TutorialStep } from "@/components/TutorialEngine";

/* ─── Floating particle ──────────────────────── */
function Particle({ x, y, size, delay, color }: { x: number; y: number; size: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color, opacity: 0.12 }}
      animate={{ y: [-10, 10, -10], opacity: [0.08, 0.18, 0.08] }}
      transition={{ duration: 5 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

/* ─── Chain link visual ──────────────────────── */
function ChainVisual() {
  const nodes = [
    { label: "Produksi", icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><rect x="2" y="6" width="12" height="8" rx="2" stroke="#1a7a4a" strokeWidth="1.5"/><path d="M5 6V4a3 3 0 016 0v2" stroke="#1a7a4a" strokeWidth="1.5" strokeLinecap="round"/></svg>, delay: 0 },
    { label: "Audit IPFS", icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M13 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="#1a7a4a" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="#1a7a4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, delay: 0.15 },
    { label: "Blockchain", icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><rect x="1" y="5" width="6" height="6" rx="1.5" stroke="#1a7a4a" strokeWidth="1.5"/><rect x="9" y="5" width="6" height="6" rx="1.5" stroke="#1a7a4a" strokeWidth="1.5"/><path d="M7 8h2" stroke="#1a7a4a" strokeWidth="1.5" strokeLinecap="round"/></svg>, delay: 0.3 },
    { label: "QR Verify", icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="#1a7a4a" strokeWidth="1.5"/><rect x="10" y="1" width="5" height="5" rx="1" stroke="#1a7a4a" strokeWidth="1.5"/><rect x="1" y="10" width="5" height="5" rx="1" stroke="#1a7a4a" strokeWidth="1.5"/><path d="M10 10h1v1M12 10h3M10 12v3M13 13h2v2" stroke="#1a7a4a" strokeWidth="1.2" strokeLinecap="round"/></svg>, delay: 0.45 },
  ];
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-0 min-w-max mx-auto">
        {nodes.map((node, i) => (
          <motion.div
            key={node.label}
            className="flex items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + node.delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="flex flex-col items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl"
              style={{
                background: "oklch(1.000 0.000 0)",
                border: "1.5px solid oklch(0.420 0.155 152 / 0.22)",
                minWidth: 60,
              }}
            >
              <div aria-hidden="true">{node.icon}</div>
              <span className="text-[9px] sm:text-[10px] font-semibold whitespace-nowrap" style={{ color: "oklch(0.420 0.155 152)" }}>
                {node.label}
              </span>
            </div>
            {i < nodes.length - 1 && (
              <motion.div
                className="flex items-center mx-0.5 sm:mx-1"
                animate={{ scaleX: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                aria-hidden="true"
              >
                <div style={{ width: 12, height: 1.5, background: "oklch(0.420 0.155 152 / 0.30)" }} />
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path d="M1 3h4M3 1l2 2-2 2" stroke="oklch(0.420 0.155 152)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Feature card ───────────────────────────── */
function FeatureCard({ icon, title, desc, delay, index }: {
  icon: React.ReactNode; title: string; desc: string; delay: number; index: number;
}) {
  return (
    <Reveal delay={delay}>
      <motion.div
        className="group relative rounded-2xl p-6 cursor-default transition-all duration-300"
        style={{
          background: "oklch(1.000 0.000 0)",
          border: "1px solid oklch(0.920 0.005 152)",
          boxShadow: "0 1px 3px oklch(0.420 0.155 152 / 0.05)",
        }}
        whileHover={{
          y: -4,
          boxShadow: "0 12px 40px oklch(0.420 0.155 152 / 0.12), 0 2px 8px oklch(0.420 0.155 152 / 0.06)",
          borderColor: "oklch(0.420 0.155 152 / 0.35)",
        }}
        transition={{ duration: 0.25 }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top left, oklch(0.420 0.155 152 / 0.04) 0%, transparent 70%)" }}
        />
        <div
          className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ background: "oklch(0.420 0.155 152 / 0.10)" }}
        >
          {icon}
        </div>
        <h3 className="text-base font-semibold mb-2" style={{ color: "oklch(0.155 0.012 152)" }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "oklch(0.480 0.018 152)" }}>{desc}</p>
      </motion.div>
    </Reveal>
  );
}

/* ─── Home Page ──────────────────────────────── */
export default function Home() {
  const { t } = useI18n();
  const { start: startTutorial, isActive } = useTutorial();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const HOME_TUTORIAL: TutorialStep[] = [
    { target: "[data-tour='hero-cta-producer']", title: t("tourHomeStep1Title"), body: t("tourHomeStep1Body"), placement: "bottom", action: "point" },
    { target: "[data-tour='hero-cta-auditor']",  title: t("tourHomeStep2Title"), body: t("tourHomeStep2Body"), placement: "bottom", action: "nod" },
    { target: "[data-tour='chain-visual']",       title: t("tourHomeStep3Title"), body: t("tourHomeStep3Body"), placement: "top",    action: "point" },
    { target: "[data-tour='features-section']",   title: t("tourHomeStep4Title"), body: t("tourHomeStep4Body"), placement: "bottom",  action: "nod" },
    { target: "[data-tour='demo-cta']",           title: t("tourHomeStep5Title"), body: t("tourHomeStep5Body"), placement: "top",    action: "celebrate" },
  ];

  const robotMsg: RobotMessage = { text: t("robotHome"), action: "wave" };

  const particles = [
    { x: 8,  y: 20, size: 48, delay: 0,   color: "oklch(0.420 0.155 152)" },
    { x: 85, y: 15, size: 32, delay: 1.5, color: "oklch(0.720 0.140 75)" },
    { x: 12, y: 70, size: 24, delay: 0.8, color: "oklch(0.420 0.155 152)" },
    { x: 92, y: 60, size: 40, delay: 2.2, color: "oklch(0.720 0.140 75)" },
    { x: 50, y: 85, size: 20, delay: 1.0, color: "oklch(0.420 0.155 152)" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "oklch(1.000 0.000 0)" }}>
      <AppHeader />

      {/* ── Hero ──────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] sm:min-h-[92dvh] items-center overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Particles — hidden on small screens for perf */}
        <div className="absolute inset-0 pointer-events-none hidden sm:block" aria-hidden="true">
          {particles.map((p, i) => <Particle key={i} {...p} />)}
        </div>

        {/* Background image */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-y-0 right-0 w-full lg:w-[58%] pointer-events-none"
          aria-hidden="true"
        >
          <img
            src="/illustration-landing-page.jpg"
            alt=""
            className="w-full h-full object-cover object-center lg:object-right"
          />
          {/* Mobile: strong white overlay so text is readable */}
          <div className="absolute inset-0 bg-white/90 sm:bg-white/80 lg:hidden" />
          {/* Desktop: gradient fade left */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/65 to-transparent hidden lg:block" />
          <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-white to-transparent hidden lg:block" />
        </motion.div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 w-full py-16 sm:py-24">
          <motion.div
            className="w-full max-w-xl"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.10 } } }}
          >
            {/* Eyebrow */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-5"
              style={{ background: "oklch(0.420 0.155 152 / 0.10)", color: "oklch(0.420 0.155 152)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.420 0.155 152)" }}
                aria-hidden="true"
              />
              Blockchain · IPFS · Halal Certified
            </motion.div>

            <motion.h1
              id="hero-heading"
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-[clamp(1.9rem,5.5vw,4.2rem)] font-semibold leading-[1.1] text-balance"
              style={{ color: "oklch(0.155 0.012 152)", letterSpacing: "-0.03em" }}
            >
              {t("heroTitle1")}{" "}
              <span className="relative inline-block" style={{ color: "oklch(0.420 0.155 152)" }}>
                {t("heroTitle2")}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: "oklch(0.420 0.155 152)" }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg leading-relaxed"
              style={{ color: "oklch(0.380 0.018 152)", maxWidth: "48ch" }}
            >
              {t("heroDesc")}
            </motion.p>

            {/* CTAs — stack on mobile, row on sm+ */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="mt-7 flex flex-col sm:flex-row gap-3"
            >
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/producer"
                  data-tour="hero-cta-producer"
                  className="flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-all"
                  style={{
                    background: "oklch(0.420 0.155 152)",
                    boxShadow: "0 4px 20px oklch(0.420 0.155 152 / 0.35)",
                  }}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {t("startProducer")}
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/auditor"
                  data-tour="hero-cta-auditor"
                  className="flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all"
                  style={{
                    border: "1.5px solid oklch(0.860 0.020 152)",
                    color: "oklch(0.155 0.012 152)",
                    background: "white",
                  }}
                >
                  {t("auditorPortal")}
                </Link>
              </motion.div>
            </motion.div>

            {/* Chain visual */}
            <motion.div
              data-tour="chain-visual"
              className="mt-12"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.5 } } }}
            >
              <ChainVisual />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────── */}
      <section
        className="py-16 sm:py-24 lg:py-32"
        style={{ background: "oklch(0.977 0.003 152)" }}
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <p className="text-sm font-medium mb-3" style={{ color: "oklch(0.420 0.155 152)" }}>
              {t("featuresSubtitle")}
            </p>
            <h2
              id="features-heading"
              data-tour="features-section"
              className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold text-balance"
              style={{ color: "oklch(0.155 0.012 152)", letterSpacing: "-0.025em" }}
            >
              {t("featuresTitle")}
            </h2>
          </Reveal>

          <div className="mt-8 sm:mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              index={0}
              delay={0.05}
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="oklch(0.420 0.155 152)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="oklch(0.420 0.155 152)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              title={t("feat1Title")}
              desc={t("feat1Desc")}
            />
            <FeatureCard
              index={1}
              delay={0.12}
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <ellipse cx="12" cy="5" rx="9" ry="3" stroke="oklch(0.420 0.155 152)" strokeWidth="1.75"/>
                  <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" stroke="oklch(0.420 0.155 152)" strokeWidth="1.75"/>
                  <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="oklch(0.420 0.155 152)" strokeWidth="1.75"/>
                </svg>
              }
              title={t("feat2Title")}
              desc={t("feat2Desc")}
            />
            <FeatureCard
              index={2}
              delay={0.20}
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" stroke="oklch(0.420 0.155 152)" strokeWidth="1.75" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" stroke="oklch(0.420 0.155 152)" strokeWidth="1.75" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" stroke="oklch(0.420 0.155 152)" strokeWidth="1.75" rx="1"/>
                  <path d="M14 14h.01M14 18h3M18 14v3M17 17h1v1" stroke="oklch(0.420 0.155 152)" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
              }
              title={t("feat3Title")}
              desc={t("feat3Desc")}
            />
          </div>

          {/* Why illustration */}
          <Reveal delay={0.1} className="mt-16">
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                boxShadow: "0 20px 60px oklch(0.420 0.155 152 / 0.10)",
                border: "1px solid oklch(0.860 0.020 152)",
              }}
            >
              <img
                src="/why-halalchain.jpg"
                alt="Ilustrasi mengapa HalalChain dibutuhkan"
                className="w-full h-64 sm:h-80 lg:h-auto lg:max-h-[600px] object-cover object-[center_35%]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section
        className="py-16 sm:py-24 px-5 sm:px-6 lg:px-10 text-center"
        style={{ background: "oklch(1.000 0.000 0)", borderTop: "1px solid oklch(0.920 0.005 152)" }}
        aria-labelledby="cta-heading"
        data-tour="demo-cta"
      >
        <Reveal>
          <div className="mx-auto max-w-2xl">
            <h2
              id="cta-heading"
              className="text-[clamp(1.6rem,3.5vw,2.5rem)] font-semibold text-balance"
              style={{ color: "oklch(0.155 0.012 152)", letterSpacing: "-0.025em" }}
            >
              {t("demoTitle2")}
            </h2>
            <p className="mx-auto mt-5 text-base leading-relaxed" style={{ color: "oklch(0.480 0.018 152)", maxWidth: "48ch" }}>
              {t("demoDesc2")}
            </p>
            <motion.div
              className="mt-8 flex justify-center"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/verify/1"
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white"
                style={{
                  background: "oklch(0.155 0.012 152)",
                  boxShadow: "0 4px 20px oklch(0.155 0.012 152 / 0.25)",
                }}
              >
                {t("tryDemo")}
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer
        className="py-8 text-center text-xs"
        style={{
          borderTop: "1px solid oklch(0.920 0.005 152)",
          color: "oklch(0.600 0.018 152)",
        }}
      >
        <p>© {new Date().getFullYear()} HalalChain · Powered by Base Network &amp; IPFS</p>
      </footer>

      {/* ── Robot Guide ───────────────────────────── */}
      <RobotGuide
        message={robotMsg}
        position="bottom-right"
        showTutorialButton={true}
        onTutorialStart={() => startTutorial(HOME_TUTORIAL)}
        autoStartKey="home"
        tourActive={isActive}
      />
    </div>
  );
}
