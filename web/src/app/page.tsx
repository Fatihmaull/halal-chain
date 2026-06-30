"use client";

import Link from "next/link";
import { AppHeader } from "@/components/ui";
import { useI18n } from "@/lib/I18nProvider";

export default function Home() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <AppHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex items-center bg-white min-h-[90vh] overflow-hidden">
          {/* Background Image restricted to right side on desktop */}
          <div className="absolute inset-y-0 right-0 w-full lg:w-[65%] z-0">
            <img
              src="/illustration-landing-page.jpg"
              alt="Ilustrasi HalalChain"
              className="w-full h-full object-cover object-center lg:object-right"
            />
            {/* Mobile overlays for text readability */}
            <div className="absolute inset-0 bg-white/85 sm:bg-white/70 lg:hidden"></div>
            
            {/* Desktop gradient: fade the left edge of the image smoothly into the white background */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent hidden lg:block"></div>
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white to-transparent hidden lg:block"></div>
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 w-full py-24">
            <div className="max-w-2xl text-center lg:text-left">
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl drop-shadow-sm">
                {t("heroTitle1")} <br className="hidden lg:block" /> {t("heroTitle2")}
              </h1>
              <p className="mx-auto lg:mx-0 mt-6 max-w-xl text-lg leading-8 text-zinc-800 font-medium drop-shadow-sm lg:drop-shadow-none">
                {t("heroDesc")}
              </p>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                <Link
                  href="/producer"
                  className="rounded-full bg-hc-blue px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-hc-blue/30 hover:opacity-90 transition-all hover:-translate-y-0.5"
                >
                  {t("startProducer")}
                </Link>
                <Link href="/auditor" className="rounded-full border border-zinc-300 px-8 py-3.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-all hover:-translate-y-0.5">
                  {t("auditorPortal")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-zinc-50 py-24 sm:py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-16">
              {/* Left: Illustration */}
              <div className="flex-1 w-full relative min-h-[320px] sm:min-h-[400px] lg:min-h-0 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/why-halalchain.jpg"
                  alt="Mengapa HalalChain"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Right: Content */}
              <div className="flex-1 w-full flex flex-col justify-center">
                <h2 className="text-base font-semibold leading-7 text-hc-blue">{t("featuresSubtitle")}</h2>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                  {t("featuresTitle")}
                </p>
                <div className="mt-10 flex flex-col gap-5">
                  {/* Card 1 */}
                  <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl p-6 transition-all hover:shadow-md">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-hc-green/10">
                      <img src="/security.svg" alt="Anti Pemalsuan" className="h-6 w-6 opacity-80" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-zinc-900">{t("feat1Title")}</div>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{t("feat1Desc")}</p>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl p-6 transition-all hover:shadow-md">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-hc-green/10">
                      <img src="/storage.svg" alt="Penyimpanan IPFS" className="h-6 w-6 opacity-80" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-zinc-900">{t("feat2Title")}</div>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{t("feat2Desc")}</p>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl p-6 transition-all hover:shadow-md">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-hc-green/10">
                      <img src="/verify.svg" alt="Mudah Diverifikasi" className="h-6 w-6 opacity-80" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-zinc-900">{t("feat3Title")}</div>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{t("feat3Desc")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="bg-white py-24 px-6 sm:py-32 lg:px-8 text-center border-t border-zinc-100">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">{t("demoTitle2")}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600">
            {t("demoDesc2")}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/verify/1"
              className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 transition-all"
            >
              {t("tryDemo")}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
