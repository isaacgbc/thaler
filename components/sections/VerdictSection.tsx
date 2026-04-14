"use client";

import type { StressReport, MonteCarloResult } from "@/lib/types";
import { firstSentence, scoreTone, stripCiteTags } from "@/lib/format";
import { SurvivalGauge } from "../charts/SurvivalGauge";
import { RiskMatrix, MatrixPoint } from "../charts/RiskMatrix";

interface Props {
  report: StressReport;
}

export function VerdictSection({ report }: Props) {
  const mc = report.results.monte_carlo as MonteCarloResult | undefined;
  const score =
    mc?.survival_rate_pct != null
      ? Math.round(mc.survival_rate_pct)
      : report.overall_score ?? 0;

  const risks = deriveRisks(report).slice(0, 3);
  const opportunities = deriveOpps(report).slice(0, 3);
  const actions = deriveActions(report).slice(0, 3);

  const matrix: MatrixPoint[] = [
    ...risks.map((r, i) => ({
      label: firstSentence(r.text).slice(0, 60),
      probability: r.probability ?? 60 + i * 8,
      impact: r.impact ?? 70 - i * 6,
      kind: "risk" as const,
    })),
    ...opportunities.map((o, i) => ({
      label: firstSentence(o.text).slice(0, 60),
      probability: o.probability ?? 55 + i * 10,
      impact: o.impact ?? 65 - i * 5,
      kind: "opportunity" as const,
    })),
  ];

  return (
    <section
      id="verdict"
      className="relative px-6 py-24 border-t border-border-subtle bg-bg-void"
    >
      <div className="max-w-[720px] mx-auto">
        <div className="text-center mb-16">
          <SurvivalGauge score={score} />
        </div>

        <div className="mb-20">
          <h3 className="font-display text-[28px] md:text-[32px] text-text-primary leading-tight tracking-[-0.01em] mb-3">
            Where risks and opportunities sit
          </h3>
          <p className="text-[16px] text-text-secondary leading-[1.6] max-w-[60ch] mb-6">
            The things most likely to happen, plotted against how much they'd
            move the business if they did.
          </p>
          <div className="bg-bg-surface border border-border-subtle rounded-sharp p-5">
            <RiskMatrix points={matrix} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12 mb-16">
          <ReadableList
            title="Top risks"
            accent="var(--danger)"
            items={risks.map((r) => firstSentence(r.text))}
          />
          <ReadableList
            title="Top opportunities"
            accent="var(--positive)"
            items={opportunities.map((o) => firstSentence(o.text))}
          />
        </div>

        <div className="border-t border-border-subtle pt-12 mb-16">
          <h3 className="font-display text-[28px] md:text-[32px] text-text-primary leading-tight tracking-[-0.01em] mb-3">
            What to do next
          </h3>
          <p className="text-[16px] text-text-secondary leading-[1.6] max-w-[60ch] mb-8">
            Three concrete actions, ordered by what will move survival the most.
          </p>
          <ol className="space-y-6">
            {actions.map((a, i) => (
              <li key={i} className="flex gap-5">
                <span className="font-display text-[36px] text-cyan leading-none shrink-0">
                  {i + 1}
                </span>
                <span className="text-[17px] text-text-primary leading-[1.6] max-w-[55ch] pt-1">
                  {firstSentence(a)}
                </span>
              </li>
            ))}
            {actions.length === 0 && (
              <li className="text-[15px] text-text-muted">
                No actionable recommendations surfaced.
              </li>
            )}
          </ol>
        </div>

        <div className="mt-20 pt-12 border-t border-border-subtle">
          <p className="font-display italic text-[20px] text-text-primary leading-[1.5] max-w-[55ch]">
            "AI can build the app. Only knowledge can tell you if it should
            exist."
          </p>
          <p className="mt-6 text-[15px] text-text-secondary leading-[1.6]">
            Built by Isaac Gutiérrez Brugada — economist, managing partner at
            LAN Accelerator (IDB Lab), president of PARCAPY.
          </p>
          <p className="mt-2 text-[13px] text-text-muted">
            Built with Claude by Anthropic.
          </p>
        </div>
      </div>
    </section>
  );
}

function ReadableList({
  title,
  accent,
  items,
}: {
  title: string;
  accent: string;
  items: string[];
}) {
  return (
    <div>
      <h3
        className="font-display text-[24px] md:text-[26px] text-text-primary leading-tight mb-5"
        style={{ borderBottom: `1px solid ${accent}`, paddingBottom: 10 }}
      >
        {title}
      </h3>
      <ul className="space-y-5">
        {items.length === 0 && (
          <li className="text-[15px] text-text-muted">
            None identified.
          </li>
        )}
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-4 text-[16px] text-text-primary leading-[1.6]"
          >
            <span
              className="shrink-0 mt-[10px] h-[6px] w-[6px] rounded-full"
              style={{ background: accent }}
            />
            <span className="max-w-[55ch]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Derive structured items with probability/impact for the matrix ---

interface Derived {
  text: string;
  probability?: number;
  impact?: number;
}

function deriveRisks(report: StressReport): Derived[] {
  const r: any = report.results;
  const out: Derived[] = [];

  const threats = r.ai_disruption?.specific_threats ?? [];
  threats.slice(0, 2).forEach((t: any) => {
    const level = t.threat_level;
    const impact = level === "high" ? 85 : level === "medium" ? 60 : 35;
    const probability = level === "high" ? 70 : level === "medium" ? 55 : 40;
    out.push({
      text: `${t.name}: ${t.what_they_do}`,
      probability,
      impact,
    });
  });

  if (r.sales?.latam_risks?.[0]?.risk)
    out.push({ text: r.sales.latam_risks[0].risk, probability: 65, impact: 60 });

  if (r.moat?.weakest_flank)
    out.push({
      text: `Weakest flank: ${r.moat.weakest_flank}`,
      probability: 55,
      impact: 65,
    });

  if (r.macro?.outlook === "hostile" || r.macro?.outlook === "challenging") {
    out.push({
      text: `Macro: ${r.macro.fx_exposure || r.macro.inflation_impact || r.macro.verdict}`,
      probability: r.macro.outlook === "hostile" ? 80 : 55,
      impact: 70,
    });
  }

  if (r.monte_carlo?.top_risk_variable)
    out.push({
      text: `Top sensitivity: ${r.monte_carlo.top_risk_variable}`,
      probability: 60,
      impact: 75,
    });

  return out.map((x) => ({ ...x, text: stripCiteTags(x.text) }));
}

function deriveOpps(report: StressReport): Derived[] {
  const r: any = report.results;
  const out: Derived[] = [];

  if (r.ai_disruption?.ai_opportunities?.[0])
    out.push({
      text: r.ai_disruption.ai_opportunities[0].opportunity,
      probability: 55,
      impact: 60,
    });

  if (r.moat?.strongest_power)
    out.push({
      text: `Double down on ${r.moat.strongest_power}`,
      probability: 65,
      impact: 60,
    });

  if (r.behavioral?.gtm_reframe)
    out.push({ text: r.behavioral.gtm_reframe, probability: 70, impact: 45 });

  if (r.demand?.unmet_needs?.[0])
    out.push({
      text: `Capture unmet need: ${r.demand.unmet_needs[0]}`,
      probability: 50,
      impact: 55,
    });

  if (r.monte_carlo?.top_leverage_variable)
    out.push({
      text: `Top leverage: ${r.monte_carlo.top_leverage_variable}`,
      probability: 60,
      impact: 70,
    });

  return out.map((x) => ({ ...x, text: stripCiteTags(x.text) }));
}

function deriveActions(report: StressReport): string[] {
  const r: any = report.results;
  const out: string[] = [];
  const mcRecs = r.monte_carlo?.recommendations;
  if (Array.isArray(mcRecs)) out.push(...mcRecs);
  if (out.length < 3 && r.sales?.gtm_recommendation)
    out.push(r.sales.gtm_recommendation);
  if (out.length < 3 && r.ai_disruption?.strategic_recommendation)
    out.push(r.ai_disruption.strategic_recommendation);
  if (out.length < 3 && r.behavioral?.gtm_reframe)
    out.push(r.behavioral.gtm_reframe);
  return out.map(stripCiteTags);
}
