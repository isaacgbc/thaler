"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  STARTUPS,
  TIER_ORDER,
  TIER_LABEL,
  allCategories,
  allCountries,
  categoryLabel,
  COUNTRY_NAMES,
  type Tier,
} from "@/lib/lan";
import { TierBadge } from "@/components/lan/TierBadge";
import { CountryFlag } from "@/components/lan/CountryFlag";
import { Footer } from "@/components/Footer";

type SortKey = "rank" | "name" | "country" | "survival" | "tier";

export default function LanRankingPage() {
  const [country, setCountry] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [tier, setTier] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("rank");
  const [asc, setAsc] = useState(true);

  const rows = useMemo(() => {
    let list = STARTUPS.slice();
    if (country !== "all")
      list = list.filter(
        (s) => s.country === country || (s.countries ?? []).includes(country)
      );
    if (category !== "all") list = list.filter((s) => s.category === category);
    if (tier !== "all") list = list.filter((s) => s.tier === tier);

    list.sort((a, b) => {
      let va: string | number;
      let vb: string | number;
      switch (sort) {
        case "name":
          va = a.name.toLowerCase();
          vb = b.name.toLowerCase();
          break;
        case "country":
          va = a.country;
          vb = b.country;
          break;
        case "survival":
          va = a.survivalPct ?? -1;
          vb = b.survivalPct ?? -1;
          break;
        case "tier":
          va = TIER_ORDER.indexOf(a.tier);
          vb = TIER_ORDER.indexOf(b.tier);
          break;
        case "rank":
        default:
          va = a.rank ?? 9999;
          vb = b.rank ?? 9999;
      }
      if (va === vb) return 0;
      const cmp = va > vb ? 1 : -1;
      return asc ? cmp : -cmp;
    });

    return list;
  }, [country, category, tier, sort, asc]);

  const onSort = (k: SortKey) => {
    if (sort === k) setAsc(!asc);
    else {
      setSort(k);
      setAsc(true);
    }
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { total: rows.length };
    for (const t of TIER_ORDER) c[t] = rows.filter((r) => r.tier === t).length;
    return c;
  }, [rows]);

  return (
    <main className="relative bg-bg-void min-h-screen">
      <nav className="px-6 pt-8 pb-4 border-b border-border-subtle">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-[20px] text-text-primary hover:text-cyan transition-colors"
          >
            Thaler
          </Link>
          <div className="flex items-center gap-6 text-[13px] font-sans text-text-secondary">
            <Link href="/lan" className="text-text-primary">
              LAN V4
            </Link>
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

      <section className="px-6 pt-16 pb-10">
        <div className="max-w-[1100px] mx-auto">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan mb-3">
            LAN Accelerator · V4 · NYC
          </p>
          <h1 className="font-display text-[48px] md:text-[64px] leading-[1.05] text-text-primary tracking-[-0.02em] mb-5">
            LAN V4 Applications
          </h1>
          <p className="font-sans text-[16px] text-text-body max-w-[720px] leading-[1.65]">
            20 startups evaluadas con el framework Thaler. 7 lentes cada una,
            web search validado, ranking por composite score (survival × LAN
            fit). Esta es la tabla maestra de cohorte.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 font-mono text-[12px]">
            <Stat label="Total" value={counts.total.toString()} />
            <Stat
              label="Strong Accept"
              value={(counts.STRONG_ACCEPT ?? 0).toString()}
              accent="positive"
            />
            <Stat
              label="Accept"
              value={(counts.ACCEPT ?? 0).toString()}
              accent="positive"
            />
            <Stat
              label="Borderline"
              value={(counts.BORDERLINE ?? 0).toString()}
              accent="warning"
            />
            <Stat
              label="Reject"
              value={(counts.REJECT ?? 0).toString()}
              accent="danger"
            />
            <Stat
              label="Pre-approved"
              value={(counts.PRE_APPROVED ?? 0).toString()}
              accent="theory"
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-6">
        <div className="max-w-[1100px] mx-auto flex flex-wrap items-end gap-3 border-t border-border-subtle pt-6">
          <Filter
            label="Country"
            value={country}
            onChange={setCountry}
            options={[
              { v: "all", l: "All" },
              ...allCountries().map((c) => ({
                v: c,
                l: `${COUNTRY_NAMES[c]?.flag ?? ""} ${c}`,
              })),
            ]}
          />
          <Filter
            label="Category"
            value={category}
            onChange={setCategory}
            options={[
              { v: "all", l: "All" },
              ...allCategories().map((c) => ({
                v: c,
                l: categoryLabel(c),
              })),
            ]}
          />
          <Filter
            label="Tier"
            value={tier}
            onChange={setTier}
            options={[
              { v: "all", l: "All" },
              ...TIER_ORDER.map((t) => ({
                v: t,
                l: TIER_LABEL[t as Tier],
              })),
            ]}
          />
          <button
            onClick={() => {
              setCountry("all");
              setCategory("all");
              setTier("all");
            }}
            className="ml-auto font-mono text-[11px] uppercase tracking-[0.08em] text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-active rounded-sharp px-3 py-2 transition-colors"
          >
            Reset
          </button>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-[1100px] mx-auto border border-border-subtle rounded-sharp overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg-elevated border-b border-border-subtle">
                <tr className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-secondary">
                  <Th
                    active={sort === "rank"}
                    asc={asc}
                    onClick={() => onSort("rank")}
                    className="w-[60px] text-center"
                  >
                    #
                  </Th>
                  <Th
                    active={sort === "name"}
                    asc={asc}
                    onClick={() => onSort("name")}
                  >
                    Startup
                  </Th>
                  <Th
                    active={sort === "country"}
                    asc={asc}
                    onClick={() => onSort("country")}
                    className="w-[100px]"
                  >
                    Country
                  </Th>
                  <th className="px-4 py-3 w-[140px]">Category</th>
                  <Th
                    active={sort === "tier"}
                    asc={asc}
                    onClick={() => onSort("tier")}
                    className="w-[130px]"
                  >
                    Tier
                  </Th>
                  <Th
                    active={sort === "survival"}
                    asc={asc}
                    onClick={() => onSort("survival")}
                    className="w-[100px] text-right"
                  >
                    Survival
                  </Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr
                    key={s.slug}
                    className="border-b border-border-subtle hover:bg-bg-elevated transition-colors"
                  >
                    <td className="px-4 py-4 font-mono text-[13px] text-text-muted text-center">
                      {s.rank ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/lan/${s.slug}`}
                        className="block group"
                      >
                        <div className="font-sans font-semibold text-[15px] text-text-primary group-hover:text-cyan transition-colors">
                          {s.name}
                          {s.redFlags?.length > 0 && (
                            <span className="ml-2 font-mono text-[10px] text-danger uppercase tracking-[0.08em]">
                              ⚠
                            </span>
                          )}
                        </div>
                        <div className="font-sans text-[13px] text-text-secondary mt-0.5 leading-[1.45] line-clamp-2 max-w-[500px]">
                          {s.summary}
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <CountryFlag code={s.country} />
                    </td>
                    <td className="px-4 py-4 font-sans text-[13px] text-text-body">
                      {categoryLabel(s.category)}
                    </td>
                    <td className="px-4 py-4">
                      <TierBadge tier={s.tier} />
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-[14px] text-text-primary">
                      {s.survivalPct != null ? `${s.survivalPct}%` : "—"}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center font-sans text-[13px] text-text-muted"
                    >
                      No startups match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="max-w-[1100px] mx-auto mt-6 font-sans text-[12px] text-text-muted leading-[1.6]">
          Internal document. Not indexed. Composite score methodology: 0.4 ×
          (Survival%) + 6 × (LAN Fit). Data as of 2026-04-17.
        </p>
      </section>

      <Footer />
    </main>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "positive" | "warning" | "danger" | "theory";
}) {
  const colorMap: Record<string, string> = {
    positive: "text-cyan",
    warning: "text-warning-dim",
    danger: "text-danger-dim",
    theory: "text-theory-dim",
  };
  const color = accent ? colorMap[accent] : "text-text-primary";
  return (
    <div>
      <div className={`text-[20px] font-semibold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-[0.12em] text-text-muted mt-0.5">
        {label}
      </div>
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-bg-surface border border-border-subtle rounded-sharp font-sans text-[13px] text-text-primary px-3 py-2 hover:border-border-active focus:border-border-focus focus:outline-none min-w-[140px]"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
}

function Th({
  children,
  onClick,
  active,
  asc,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  asc?: boolean;
  className?: string;
}) {
  return (
    <th
      onClick={onClick}
      className={`px-4 py-3 select-none ${
        onClick ? "cursor-pointer hover:text-text-primary" : ""
      } ${active ? "text-text-primary" : ""} ${className}`}
    >
      {children}
      {active && (
        <span className="ml-1 text-text-muted">{asc ? "↑" : "↓"}</span>
      )}
    </th>
  );
}
