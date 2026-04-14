"use client";

import Link from "next/link";

const LINES = [
  "Every year, millions of businesses launch.",
  "Most fail within 18 months.",
  "Not because the product was bad.",
  "Because nobody stress-tested the economics.",
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-void">
      <Link
        href="/portfolio"
        className="absolute top-6 right-6 text-[11px] uppercase tracking-[0.2em] text-text-muted hover:text-cyan transition-colors font-sans font-medium z-20"
      >
        Portfolio validation →
      </Link>
      <div className="relative z-10 max-w-[680px] w-full px-6 text-center">
        <div className="mb-24 space-y-5">
          {LINES.map((line, i) => (
            <p
              key={i}
              className="font-sans font-normal text-[19px] md:text-[20px] text-text-secondary leading-[1.5] fade-up"
              style={{ animationDelay: `${i * 0.6 + 0.2}s` }}
            >
              {line}
            </p>
          ))}
        </div>

        <div className="fade-up" style={{ animationDelay: "2.8s" }}>
          <h1 className="font-display text-[88px] md:text-[120px] text-text-primary leading-none tracking-[-0.025em]">
            Thaler
          </h1>
          <p className="mt-8 font-display italic text-[20px] md:text-[22px] text-cyan">
            Theory. Street. Data.
          </p>
        </div>

        <div
          className="mt-24 fade-up flex flex-col items-center gap-3"
          style={{ animationDelay: "3.4s" }}
        >
          <p className="text-[13px] text-text-muted font-sans">
            Scroll to begin
          </p>
          <div className="scroll-hint" />
        </div>
      </div>
    </section>
  );
}
