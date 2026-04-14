"use client";

import { useState } from "react";
import { DEMO_PRESETS } from "@/lib/demos";

interface Props {
  onSubmit: (input: string) => void;
  disabled?: boolean;
}

export function InputForm({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length < 20) return;
    onSubmit(trimmed);
  };

  return (
    <section
      id="input"
      className="relative min-h-screen flex items-center justify-center px-6 py-24 border-t border-border-subtle bg-bg-void"
    >
      <div className="max-w-[680px] w-full">
        <div className="mb-10">
          <h2 className="font-display text-[40px] md:text-[52px] text-text-primary leading-[1.05] tracking-[-0.02em]">
            Describe the business you want stress-tested.
          </h2>
          <p className="mt-6 text-[17px] text-text-secondary leading-[1.6] max-w-[60ch]">
            A paragraph is enough. Revenue, team, market, runway — any detail
            that matters. The more specific you are, the sharper the analysis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
            placeholder="A chain of 3 industrial laundries in Buenos Aires, serving boutique hotels and restaurants. $40K USD/month. 15 employees. 8 years operating. Looking to open a 4th plant."
            className="w-full min-h-[180px] bg-bg-input border border-border-subtle rounded-sharp p-5 text-[16px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan transition-colors font-sans leading-[1.6] resize-none"
          />

          <div>
            <p className="text-[14px] text-text-muted font-sans mb-3">
              Or try one of these:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setValue(preset.input)}
                  disabled={disabled}
                  className="text-left p-4 border border-border-subtle hover:border-cyan/50 bg-bg-surface hover:bg-bg-elevated rounded-sharp transition-colors disabled:opacity-50"
                >
                  <div className="font-display text-[18px] text-text-primary leading-tight mb-1">
                    {preset.label.replace(/\s*—\s*.*$/, "")}
                  </div>
                  <div className="text-[13px] text-text-secondary leading-snug">
                    {preset.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
            <p className="text-[14px] text-text-muted font-sans">
              7 economic lenses. Real data. About 90 seconds.
            </p>
            <button
              type="submit"
              disabled={disabled || value.trim().length < 20}
              className="px-8 py-3.5 bg-cyan text-text-inverse hover:brightness-110 font-sans font-semibold text-[15px] rounded-sharp transition-[filter] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Run stress test →
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
