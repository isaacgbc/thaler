import Link from "next/link";
import { notFound } from "next/navigation";
import { STARTUPS, getStartup, categoryLabel, COUNTRY_NAMES } from "@/lib/lan";
import { TierBadge } from "@/components/lan/TierBadge";
import { CountryFlag } from "@/components/lan/CountryFlag";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return STARTUPS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = getStartup(params.slug);
  if (!s) return { title: "Not found" };
  return {
    title: `${s.name} — LAN V4 Thaler`,
    robots: { index: false, follow: false },
  };
}

export default function StartupDetail({
  params,
}: {
  params: { slug: string };
}) {
  const s = getStartup(params.slug);
  if (!s) notFound();

  const hasTraction =
    s.traction.mrr || s.traction.arr || s.traction.clients || s.traction.users;

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
              href="/lan/paraguay"
              className="hover:text-text-primary transition-colors"
            >
              Paraguay
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
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {s.rank != null && (
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
                Rank #{s.rank} · {categoryLabel(s.category)}
              </span>
            )}
            {s.dataConfidence === "LOW" && (
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-warning-dim border border-warning/30 bg-warning-light px-2 py-0.5 rounded-sharp">
                Data confidence: Low
              </span>
            )}
            {s.dataConfidence === "NONE" && (
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-warning-dim border border-warning/30 bg-warning-light px-2 py-0.5 rounded-sharp">
                Analysis pending
              </span>
            )}
          </div>
          <h1 className="font-display text-[56px] md:text-[72px] leading-[1.02] text-text-primary tracking-[-0.02em] mb-4">
            {s.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-7">
            <TierBadge tier={s.tier} size="md" />
            {(s.countries ?? [s.country]).map((c) => (
              <CountryFlag key={c} code={c} showName />
            ))}
            {s.stage && s.stage !== "pending" && (
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted">
                {s.stage}
              </span>
            )}
          </div>

          <p className="font-sans text-[18px] text-text-body leading-[1.6] max-w-[720px] mb-8">
            {s.summary}
          </p>

          {s.recommendation && (
            <div className="border-l-2 border-cyan pl-5 py-1 mb-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted mb-1">
                Recommendation
              </div>
              <div className="font-sans text-[15px] text-text-primary leading-[1.5]">
                {s.recommendation}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Metric
              label="Survival"
              value={s.survivalPct != null ? `${s.survivalPct}%` : "—"}
              accent={
                s.survivalPct == null
                  ? undefined
                  : s.survivalPct >= 70
                  ? "positive"
                  : s.survivalPct >= 55
                  ? "warning"
                  : "danger"
              }
            />
            <Metric
              label="LAN Fit"
              value={s.lanFit != null ? `${s.lanFit}/10` : "—"}
            />
            <Metric
              label="Moat"
              value={s.moatScore != null ? `${s.moatScore}` : "—"}
              suffix={s.moatScore != null ? "/100" : undefined}
            />
            <Metric
              label="Stage"
              value={s.stage && s.stage !== "pending" ? s.stage : "—"}
            />
          </div>

          {hasTraction && (
            <div className="mb-10 border border-border-subtle rounded-sharp bg-bg-surface p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted mb-3">
                Traction
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[13px]">
                {s.traction.arr != null && (
                  <span>
                    <span className="text-text-muted">ARR</span>{" "}
                    <span className="text-text-primary">
                      ${fmtMoney(s.traction.arr)}
                    </span>
                  </span>
                )}
                {s.traction.mrr != null && (
                  <span>
                    <span className="text-text-muted">MRR</span>{" "}
                    <span className="text-text-primary">
                      ${fmtMoney(s.traction.mrr)}
                    </span>
                  </span>
                )}
                {s.traction.clients != null && (
                  <span>
                    <span className="text-text-muted">Clients</span>{" "}
                    <span className="text-text-primary">
                      {s.traction.clients}
                    </span>
                  </span>
                )}
                {s.traction.users != null && (
                  <span>
                    <span className="text-text-muted">Users</span>{" "}
                    <span className="text-text-primary">
                      {s.traction.users}
                    </span>
                  </span>
                )}
              </div>
              {s.traction.note && (
                <p className="font-sans text-[13px] text-text-body mt-3 leading-[1.55]">
                  {s.traction.note}
                </p>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Block title="Strengths" items={s.strengths} accent="positive" />
            <Block title="Risks" items={s.risks} accent="warning" />
            <Block
              title="Tailwinds"
              items={s.tailwinds}
              accent="positive"
              emptyMsg="No explicit tailwinds noted."
            />
            <Block
              title="Red Flags"
              items={s.redFlags}
              accent="danger"
              emptyMsg="None flagged."
            />
          </div>

          {s.founders?.length > 0 && (
            <div className="mb-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted mb-2">
                Founders
              </div>
              <div className="font-sans text-[14px] text-text-body">
                {s.founders.join(", ")}
              </div>
            </div>
          )}

          {s.verdict && (
            <div className="mb-10 bg-bg-elevated border border-border-subtle rounded-sharp p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted mb-2">
                Verdict
              </div>
              <p className="font-display text-[20px] italic text-text-primary leading-[1.5]">
                {s.verdict}
              </p>
            </div>
          )}

          {s.fullReport && (
            <details className="mb-10 border border-border-subtle rounded-sharp bg-bg-surface">
              <summary className="cursor-pointer font-mono text-[12px] uppercase tracking-[0.1em] text-text-secondary hover:text-text-primary px-5 py-4">
                Full Thaler report
              </summary>
              <pre className="px-5 pb-5 overflow-x-auto font-mono text-[12px] text-text-body whitespace-pre-wrap leading-[1.65]">
                {s.fullReport}
              </pre>
            </details>
          )}

          <p className="font-mono text-[11px] text-text-muted">
            Updated {s.updatedAt} · Source: {s.thalerPath || "analysis pending"}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Metric({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: string;
  suffix?: string;
  accent?: "positive" | "warning" | "danger";
}) {
  const colorMap: Record<string, string> = {
    positive: "text-cyan",
    warning: "text-warning-dim",
    danger: "text-danger-dim",
  };
  const color = accent ? colorMap[accent] : "text-text-primary";
  return (
    <div className="border border-border-subtle rounded-sharp bg-bg-surface p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted mb-1.5">
        {label}
      </div>
      <div className={`font-mono text-[22px] font-semibold ${color}`}>
        {value}
        {suffix && (
          <span className="text-[12px] text-text-muted ml-0.5">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function Block({
  title,
  items,
  accent,
  emptyMsg,
}: {
  title: string;
  items: string[];
  accent: "positive" | "warning" | "danger";
  emptyMsg?: string;
}) {
  const dotColor: Record<string, string> = {
    positive: "bg-cyan",
    warning: "bg-warning",
    danger: "bg-danger",
  };
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted mb-3">
        {title}
      </div>
      {items?.length > 0 ? (
        <ul className="space-y-2">
          {items.map((x, i) => (
            <li key={i} className="flex gap-2 font-sans text-[14px] text-text-body leading-[1.55]">
              <span
                className={`mt-[7px] w-1 h-1 rounded-full flex-shrink-0 ${dotColor[accent]}`}
              />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-sans text-[13px] text-text-muted italic">
          {emptyMsg ?? "None."}
        </p>
      )}
    </div>
  );
}

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}
