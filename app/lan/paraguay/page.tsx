import Link from "next/link";
import { paraguayPool } from "@/lib/lan";
import { ParaguayBoard } from "@/components/lan/ParaguayBoard";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Paraguay Slots — LAN V4",
  robots: { index: false, follow: false },
};

export default async function ParaguayPage() {
  const pool = paraguayPool();

  let initialOrder: string[] = [];
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const res = await fetch(`${base}/api/paraguay-ranking`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.order)) initialOrder = data.order;
    }
  } catch {
    // swallow — falls back to default order
  }

  return (
    <main className="relative bg-bg-void min-h-screen">
      <nav className="px-6 pt-8 pb-4 border-b border-border-subtle">
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <Link
            href="/lan"
            className="font-display text-[18px] text-text-primary hover:text-cyan transition-colors"
          >
            ← LAN V4
          </Link>
          <div className="flex items-center gap-6 text-[13px] font-sans text-text-secondary">
            <Link
              href="/lan"
              className="hover:text-text-primary transition-colors"
            >
              Ranking
            </Link>
            <Link
              href="/portfolio"
              className="hover:text-text-primary transition-colors"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </nav>

      <section className="px-6 pt-14 pb-10">
        <div className="max-w-[900px] mx-auto">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan mb-3">
            Paraguay · 3 slots
          </p>
          <h1 className="font-display text-[48px] md:text-[56px] leading-[1.05] text-text-primary tracking-[-0.02em] mb-4">
            Paraguay cohort slots
          </h1>
          <p className="font-sans text-[15px] text-text-body leading-[1.65] max-w-[680px] mb-10">
            Drag to order. Top 3 slots are the confirmed picks. Everything
            below is waitlist. Changes persist across sessions. Pool is limited
            to non-rejected startups based or operating in Paraguay.
          </p>

          <ParaguayBoard pool={pool} initialOrder={initialOrder} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
