"use client";

import React, { useState } from "react";
import { AGENT_META, AgentId } from "@/lib/types";
import { firstSentence, stripCiteTags } from "@/lib/format";

interface Props {
  id: AgentId;
  headline: string;
  headlineTone?: "good" | "warn" | "bad" | "neutral" | "cyan";
  verdict: string;
  survivalModifier: number;
  elapsedMs?: number;
  partial?: boolean;
  rawText?: string;
  children: React.ReactNode;
}

const toneText = {
  good: "text-positive",
  warn: "text-warning",
  bad: "text-danger",
  neutral: "text-text-primary",
  cyan: "text-cyan",
} as const;

const toneBg = {
  good: "bg-positive/10",
  warn: "bg-warning/10",
  bad: "bg-danger/10",
  neutral: "bg-bg-elevated",
  cyan: "bg-cyan/10",
} as const;

const toneBorder = {
  good: "border-l-positive",
  warn: "border-l-warning",
  bad: "border-l-danger",
  neutral: "border-l-border-active",
  cyan: "border-l-cyan",
} as const;

export function CollapsibleCard({
  id,
  headline,
  headlineTone = "cyan",
  verdict,
  partial,
  rawText,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const meta = AGENT_META[id];
  const cleanVerdict = firstSentence(verdict);

  return (
    <article
      className={`border border-border-subtle hover:border-border-active bg-bg-surface rounded-sharp border-l-2 ${toneBorder[headlineTone]} transition-colors`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left p-6 md:p-7 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan rounded-sharp"
      >
        <div className="flex items-start justify-between gap-6 mb-3">
          <h3 className="font-display text-[22px] md:text-[24px] text-text-primary leading-tight tracking-[-0.005em]">
            {meta.name}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            {partial ? (
              <span className="text-[12px] px-3 py-1 bg-warning/10 text-warning rounded-sharp">
                Partial
              </span>
            ) : (
              <span
                className={`text-[12px] font-sans font-semibold uppercase tracking-[0.08em] px-3 py-1 rounded-sharp ${toneText[headlineTone]} ${toneBg[headlineTone]}`}
              >
                {headline}
              </span>
            )}
          </div>
        </div>

        <p className="text-[16px] text-text-secondary leading-[1.6] max-w-[65ch] line-clamp-3">
          {cleanVerdict ||
            (partial ? "Analysis returned unstructured output." : "")}
        </p>

        <div className="mt-4 text-[13px] text-text-muted font-sans">
          {open ? "Hide details ↑" : "Show details ↓"}
        </div>
      </button>

      <div className={`expand-enter ${open ? "open" : ""}`}>
        <div className="px-6 md:px-7 pb-7 pt-4 border-t border-border-subtle">
          <p className="font-serif italic text-[13px] text-theory mb-5 max-w-[65ch] leading-relaxed">
            Based on {meta.framework}
          </p>
          {partial ? (
            <div className="space-y-3">
              <p className="text-[13px] text-warning">
                The model returned unstructured output. Raw analysis:
              </p>
              <pre className="whitespace-pre-wrap break-words text-[14px] text-text-secondary font-sans leading-[1.6] max-w-[65ch]">
                {stripCiteTags(rawText ?? "")}
              </pre>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </article>
  );
}
