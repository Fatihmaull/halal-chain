import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="font-semibold tracking-tight">HalalChain</div>
          <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <Link className="hover:text-zinc-950 dark:hover:text-zinc-50" href="/producer">
              Producer
            </Link>
            <Link className="hover:text-zinc-950 dark:hover:text-zinc-50" href="/auditor">
              Auditor
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
        <section className="rounded-2xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-950">
          <h1 className="text-2xl font-semibold tracking-tight">Verifikasi Halal (prototype)</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Konsumen cukup buka link verifikasi batch: <span className="font-mono">/verify/{"{batchId}"}</span>
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              href="/verify/1"
            >
              Coba contoh: Batch #1
            </Link>
            <a
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
              href="https://github.com/Fatihmaull/halal-chain"
              target="_blank"
              rel="noreferrer"
            >
              Repo (dokumen)
            </a>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card
            title="Konsumen"
            desc="Read-only. Cek status batch tanpa wallet."
            href="/verify/1"
            cta="Buka verifikasi"
          />
          <Card title="Produsen" desc="Register batch + upload CID IPFS." href="/producer" cta="Buka dashboard" />
          <Card title="Auditor" desc="Verify / reject batch (role auditor)." href="/auditor" cta="Buka dashboard" />
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
      <Link
        className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-black/5 px-4 text-sm font-medium hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
        href={href}
      >
        {cta}
      </Link>
    </div>
  );
}
