import Link from "next/link";
import { STARTUPS, categoryLabel } from "@/lib/lan";
import { TierBadge } from "@/components/lan/TierBadge";
import { CountryFlag } from "@/components/lan/CountryFlag";

export function LanV4Section() {
  const sorted = [...STARTUPS]
    .filter((s) => s.rank != null)
    .sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));

  const tierCounts = {
    STRONG_ACCEPT: STARTUPS.filter((s) => s.tier === "STRONG_ACCEPT").length,
    ACCEPT: STARTUPS.filter((s) => s.tier === "ACCEPT").length,
    BORDERLINE: STARTUPS.filter((s) => s.tier === "BORDERLINE").length,
    REJECT: STARTUPS.filter((s) => s.tier === "REJECT").length,
    PRE_APPROVED: STARTUPS.filter((s) => s.tier === "PRE_APPROVED").length,
  };

  return (
    <section className="px-6 py-20 bg-bg-elevated border-t border-border-subtle">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan mb-2">
              LAN Accelerator
            </p>
            <h2 className="font-display text-[40px] md:text-[48px] text-text-primary leading-[1.05] tracking-[-0.02em]">
              LAN V4 Applications
            </h2>
            <p className="font-sans text-[15px] text-text-body mt-3 max-w-[640px] leading-[1.6]">
              {STARTUPS.length} startups evaluadas con el framework Thaler.
              Seven-lens analysis per company, web search validado, composite
              score por survival × LAN fit.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/lan"
              className="font-mono text-[12px] uppercase tracking-[0.1em] bg-text-primary text-text-inverse px-5 py-3 rounded-sharp hover:bg-cyan transition-colors"
            >
              Full ranking →
            </Link>
            <Link
              href="/lan/paraguay"
              className="font-mono text-[12px] uppercase tracking-[0.1em] border border-border-active text-text-primary px-5 py-3 rounded-sharp hover:border-cyan hover:text-cyan transition-colors"
            >
              Paraguay slots
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          <TierStat
            label="Strong Accept"
            count={tierCounts.STRONG_ACCEPT}
            accent="cyan"
          />
          <TierStat label="Accept" count={tierCounts.ACCEPT} accent="cyan" />
          <TierStat
            label="Borderline"
            count={tierCounts.BORDERLINE}
            accent="warn"
          />
          <TierStat
            label="Pre-approved"
            count={tierCounts.PRE_APPROVED}
            accent="theory"
          />
          <TierStat label="Reject" count={tierCounts.REJECT} accent="danger" />
        </div>

        <div className="border border-border-subtle rounded-sharp bg-bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg-elevated border-b border-border-subtle">
                <tr className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-secondary">
                  <th className="px-4 py-3 w-[50px] text-center">#</th>
                  <th className="px-4 py-3">Startup</th>
                  <th className="px-4 py-3 w-[80px]">Country</th>
                  <th className="px-4 py-3 w-[120px]">Category</th>
                  <th className="px-4 py-3 w-[120px]">Tier</th>
                  <th className="px-4 py-3 w-[90px] text-right">Survival</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr
                    key={s.slug}
                    className="border-b border-border-subtle last:border-0 hover:bg-bg-elevated/70 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-[12px] text-text-muted text-center">
                      {s.rank}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/lan/${s.slug}`}
                        className="font-sans font-semibold text-[14px] text-text-primary hover:text-cyan transition-colors"
                      >
                        {s.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <CountryFlag code={s.country} />
                    </td>
                    <td className="px-4 py-3 font-sans text-[12px] text-text-body">
                      {categoryLabel(s.category)}
                    </td>
                    <td className="px-4 py-3">
                      <TierBadge tier={s.tier} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[13px] text-text-primary">
                      {s.survivalPct != null ? `${s.survivalPct}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="font-sans text-[12px] text-text-muted mt-5 leading-[1.6]">
          Internal evaluation doc. Not indexed, link-only access.{" "}
          <Link
            href="/lan"
            className="underline hover:text-text-primary transition-colors"
          >
            View full ranking with filters, detail pages, and Paraguay slot
            board →
          </Link>
        </p>
      </div>
    </section>
  );
}

function TierStat({
  label,
  count,
  accent,
}: {
  label: string;
  count: number;
  accent: "cyan" | "warn" | "danger" | "theory";
}) {
  const colorMap = {
    cyan: "text-cyan",
    warn: "text-warning-dim",
    danger: "text-danger-dim",
    theory: "text-theory-dim",
  };
  return (
    <div className="border border-border-subtle bg-bg-surface rounded-sharp px-4 py-3">
      <div className={`font-mono text-[24px] font-semibold ${colorMap[accent]}`}>
        {count}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-muted mt-0.5">
        {label}
      </div>
    </div>
  );
}
