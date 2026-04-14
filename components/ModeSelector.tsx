"use client";

import Link from "next/link";

interface Props {
  onSelectAnalyze?: () => void;
  className?: string;
}

export function ModeSelector({ onSelectAnalyze, className = "" }: Props) {
  return (
    <section className={`px-6 py-12 bg-bg-void ${className}`}>
      <div className="max-w-[1000px] mx-auto">
        <div className="subhead text-center mb-6">Choose how you want to use Thaler</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button
            onClick={onSelectAnalyze}
            className="group text-left consulting-card p-6 md:p-7 hover:shadow-card-hover hover:border-cyan/60 transition-all"
          >
            <div className="text-[10px] uppercase tracking-[0.18em] text-cyan font-sans font-medium mb-2">
              Mode A
            </div>
            <h3 className="font-display text-[26px] md:text-[28px] text-text-primary leading-[1.1] tracking-[-0.01em] mb-2">
              Analyze a business
            </h3>
            <p className="text-[14px] text-text-body font-sans leading-[1.6]">
              Stress-test any business against real economic data.
            </p>
            <p className="text-[12px] text-text-muted font-sans mt-3 leading-[1.5]">
              For founders, operators, and investors.
            </p>
            <div className="text-[11px] text-cyan font-sans mt-5 tracking-[0.08em] group-hover:translate-x-0.5 transition-transform">
              Start analysis →
            </div>
          </button>

          <Link
            href="/portfolio"
            className="group text-left consulting-card p-6 md:p-7 hover:shadow-card-hover hover:border-cyan/60 transition-all"
          >
            <div className="text-[10px] uppercase tracking-[0.18em] text-cyan font-sans font-medium mb-2">
              Mode B
            </div>
            <h3 className="font-display text-[26px] md:text-[28px] text-text-primary leading-[1.1] tracking-[-0.01em] mb-2">
              Monitor a portfolio
            </h3>
            <p className="text-[14px] text-text-body font-sans leading-[1.6]">
              Track multiple companies across 8 lenses over time.
            </p>
            <p className="text-[12px] text-text-muted font-sans mt-3 leading-[1.5]">
              For fund managers and boards.
            </p>
            <div className="text-[11px] text-cyan font-sans mt-5 tracking-[0.08em] group-hover:translate-x-0.5 transition-transform">
              Open portfolio →
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
