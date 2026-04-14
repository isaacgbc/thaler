"use client";

import React from "react";

interface Props {
  number: number;
  kicker: string;
  title: string;
  citation: string;
  verdict: string;
  modifier?: number;
  modifierLabel?: string;
  children: React.ReactNode;
}

function modifierColor(m: number | undefined): string {
  if (m === undefined) return "text-text-secondary";
  if (m >= 5) return "text-accent-emerald";
  if (m <= -5) return "text-accent-red";
  if (m < 0) return "text-accent-amber";
  return "text-accent-cyan";
}

function modifierSign(m: number): string {
  return m > 0 ? `+${m}` : `${m}`;
}

export function SectionShell({
  number,
  kicker,
  title,
  citation,
  verdict,
  modifier,
  modifierLabel = "Survival Δ",
  children,
}: Props) {
  return (
    <section className="relative px-6 py-20 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">
              {String(number).padStart(2, "0")} — {kicker}
            </p>
            {typeof modifier === "number" && (
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-data">
                  {modifierLabel}
                </span>
                <span
                  className={`font-data text-xl ${modifierColor(modifier)}`}
                >
                  {modifierSign(modifier)}
                </span>
              </div>
            )}
          </div>

          <h2 className="font-display text-4xl md:text-5xl text-text-primary leading-tight mb-6">
            {title}
          </h2>

          {citation && (
            <p className="citation max-w-3xl border-l-2 border-accent-violet/60 pl-4 mb-6">
              {citation}
            </p>
          )}

          <p className="font-display text-2xl md:text-3xl text-text-primary/90 leading-snug">
            {verdict}
          </p>
        </div>

        <div className="space-y-6">{children}</div>
      </div>
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "good" | "warn" | "bad" | "accent";
}) {
  const toneClass = {
    default: "text-text-primary",
    good: "text-accent-emerald",
    warn: "text-accent-amber",
    bad: "text-accent-red",
    accent: "text-accent-cyan",
  }[tone];

  return (
    <div className="bg-bg-surface border border-border p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-data mb-2">
        {label}
      </div>
      <div className={`font-display text-3xl ${toneClass}`}>{value}</div>
      {hint && (
        <div className="text-[11px] text-text-secondary font-data mt-2">
          {hint}
        </div>
      )}
    </div>
  );
}

export function FindingRow({
  children,
  impact,
  source,
}: {
  children: React.ReactNode;
  impact?: "positive" | "negative" | "neutral" | "mixed";
  source?: string;
}) {
  const color =
    impact === "positive"
      ? "border-l-accent-emerald"
      : impact === "negative"
      ? "border-l-accent-red"
      : impact === "mixed"
      ? "border-l-accent-amber"
      : "border-l-accent-cyan";
  return (
    <div
      className={`border-l-2 pl-4 py-2 ${color} bg-bg-surface/60`}
    >
      <p className="text-text-primary/90 text-[15px] leading-relaxed">
        {children}
      </p>
      {source && (
        <p className="mt-1 text-[11px] text-text-secondary font-data uppercase tracking-wider">
          {source}
        </p>
      )}
    </div>
  );
}
