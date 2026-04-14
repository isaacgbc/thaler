"use client";

import { useEffect, useRef, useState } from "react";
import { Hero } from "@/components/Hero";
import { InputForm } from "@/components/InputForm";
import { AgentRunning } from "@/components/AgentRunning";
import { Dashboard } from "@/components/Dashboard";
import { LensRadar } from "@/components/charts/LensRadar";
import { MacroSection } from "@/components/sections/MacroSection";
import { DemandSection } from "@/components/sections/DemandSection";
import { MoatSection } from "@/components/sections/MoatSection";
import { SalesSection } from "@/components/sections/SalesSection";
import { BehavioralSection } from "@/components/sections/BehavioralSection";
import { AIDisruptionSection } from "@/components/sections/AIDisruptionSection";
import { FounderSection } from "@/components/sections/FounderSection";
import { MonteCarloSection } from "@/components/sections/MonteCarloSection";
import { VerdictSection } from "@/components/sections/VerdictSection";
import { MethodologyExplainer } from "@/components/MethodologyExplainer";
import { ModeSelector } from "@/components/ModeSelector";
import { InstallSkills } from "@/components/InstallSkills";
import { Footer } from "@/components/Footer";
import type {
  StressReport,
  MacroResult,
  DemandResult,
  MoatResult,
  SalesResult,
  BehavioralResult,
  AIDisruptionResult,
  FounderResult,
  MonteCarloResult,
} from "@/lib/types";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<StressReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const agentsRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) return;
    const start = Date.now();
    const t = setInterval(() => setElapsedMs(Date.now() - start), 100);
    return () => clearInterval(t);
  }, [loading]);

  // ?demo=1 loads the cached Azos result from /api/demo for visual testing.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") !== "1") return;
    fetch("/api/demo")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json) setReport(json as StressReport);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(input: string) {
    setError(null);
    setReport(null);
    setLoading(true);
    setElapsedMs(0);

    setTimeout(() => {
      agentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, mode: "full" }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }

      const data: StressReport = await res.json();
      setReport(data);
      setTimeout(() => {
        dashboardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 400);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.error("[thaler] analyze failed:", msg);
    } finally {
      setLoading(false);
    }
  }

  const r = report?.results;

  return (
    <main className="relative bg-bg-void">
      <Hero />
      <ModeSelector
        onSelectAnalyze={() => {
          const el = document.getElementById("analyze-input");
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />
      <div id="analyze-input">
        <InputForm onSubmit={handleSubmit} disabled={loading} />
      </div>

      <div ref={agentsRef}>
        <AgentRunning loading={loading} report={report} elapsedMs={elapsedMs} />
      </div>

      {error && (
        <section className="px-6 py-16 border-t border-border-subtle bg-bg-void">
          <div className="max-w-editorial mx-auto border border-danger/40 bg-danger/5 p-6 rounded-sharp">
            <p className="text-[11px] uppercase tracking-[0.2em] text-danger mb-2 font-sans font-medium">
              Analysis failed
            </p>
            <p className="font-data text-[13px] text-danger/90">{error}</p>
          </div>
        </section>
      )}

      {report && (
        <div ref={dashboardRef}>
          <Dashboard report={report} />
        </div>
      )}

      {report && (
        <section className="px-6 py-20 bg-bg-void border-t border-border-subtle">
          <div className="max-w-[720px] mx-auto">
            <h2 className="font-display text-[36px] md:text-[44px] text-text-primary leading-[1.05] tracking-[-0.015em] mb-3">
              Where the business is strong and weak.
            </h2>
            <p className="text-[17px] text-text-secondary leading-[1.6] max-w-[55ch] mb-10">
              Each spoke is one of the seven lenses. The further from the
              centre, the stronger. An ideal business is convex.
            </p>
            <div className="bg-bg-surface border border-border-subtle rounded-sharp p-4 md:p-6">
              <LensRadar report={report} />
            </div>
          </div>
        </section>
      )}

      {report && (
        <section className="px-6 py-16 bg-bg-void border-t border-border-subtle">
          <div className="max-w-[720px] mx-auto">
            <h2 className="font-display text-[36px] md:text-[44px] text-text-primary leading-[1.05] tracking-[-0.015em] mb-3">
              The seven lenses, in detail.
            </h2>
            <p className="text-[17px] text-text-secondary leading-[1.6] max-w-[55ch] mb-10">
              Tap any lens to expand. Each is an independent analysis grounded
              in a named academic framework.
            </p>
            <div className="space-y-3">
              {r?.macro && <MacroSection data={r.macro as MacroResult} />}
              {r?.demand && <DemandSection data={r.demand as DemandResult} />}
              {r?.moat && <MoatSection data={r.moat as MoatResult} />}
              {r?.sales && <SalesSection data={r.sales as SalesResult} />}
              {r?.behavioral && (
                <BehavioralSection data={r.behavioral as BehavioralResult} />
              )}
              {r?.ai_disruption && (
                <AIDisruptionSection data={r.ai_disruption as AIDisruptionResult} />
              )}
              {r?.founder && (
                <FounderSection data={r.founder as FounderResult} />
              )}
              {r?.monte_carlo && (
                <MonteCarloSection data={r.monte_carlo as MonteCarloResult} />
              )}
            </div>
          </div>
        </section>
      )}

      {report && <VerdictSection report={report} />}

      <MethodologyExplainer />

      <InstallSkills />

      <Footer />
    </main>
  );
}
