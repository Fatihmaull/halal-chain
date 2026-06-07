"use client";

import Link from "next/link";
import { useI18n } from "@/lib/I18nProvider";
import { AppHeader } from "@/components/ui";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
        <section className="rounded-2xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-950">
          <h1 className="text-2xl font-semibold tracking-tight">{t("demoTitle")}</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t("demoDesc")}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary inline-flex items-center justify-center" href="/verify/1">
              {t("tryExample")}
            </Link>
            <a
              className="btn-secondary inline-flex items-center justify-center"
              href="https://github.com/Fatihmaull/halal-chain"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card title={t("consumer")} desc={t("demoDesc")} href="/verify/1" cta={t("verifyBatch")} />
          <Card title={t("producer")} desc={t("registerBatch")} href="/producer" cta={t("producer")} />
          <Card title={t("auditor")} desc={`${t("verify")} / ${t("reject")}`} href="/auditor" cta={t("auditor")} />
        </section>
      </main>
    </div>
  );
}

function Card({ title, desc, href, cta }: { title: string; desc: string; href: string; cta: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-950">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{desc}</div>
      <Link className="btn-secondary mt-5 inline-flex items-center justify-center" href={href}>
        {cta}
      </Link>
    </div>
  );
}
