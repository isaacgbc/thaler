"use client";

import React from "react";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "cyan" | "good" | "warn" | "bad" | "neutral";
  size?: "lg" | "md" | "sm";
  progress?: number; // 0-100, draws a progress bar under the value
}

const toneColor = {
  cyan: "text-cyan",
  good: "text-positive",
  warn: "text-warning",
  bad: "text-danger",
  neutral: "text-text-primary",
} as const;

const sizeClass = {
  lg: "text-5xl md:text-6xl",
  md: "text-3xl md:text-4xl",
  sm: "text-2xl",
} as const;

export function MetricCard({
  label,
  value,
  hint,
  tone = "cyan",
  size = "md",
  progress,
}: Props) {
  return (
    <div className="bg-bg-surface border border-border-subtle hover:border-border-active transition-colors p-5 md:p-6 rounded-sharp">
      <div className="font-sans text-[14px] text-text-secondary mb-3">
        {label}
      </div>
      <div className={`font-data font-semibold tabular-nums leading-none ${sizeClass[size]} ${toneColor[tone]}`}>
        {value}
      </div>
      {typeof progress === "number" && (
        <div className="progress-track mt-5">
          <div
            className={`progress-fill ${
              tone === "good"
                ? "bg-positive"
                : tone === "warn"
                ? "bg-warning"
                : tone === "bad"
                ? "bg-danger"
                : "bg-cyan"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
      {hint && (
        <div className="text-[14px] text-text-muted font-sans leading-[1.5] mt-4">
          {hint}
        </div>
      )}
    </div>
  );
}
