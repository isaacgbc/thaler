"use client";

import { AGENT_META, AgentId } from "@/lib/types";

export type AgentRunState = "pending" | "running" | "done" | "error";

interface Props {
  id: AgentId;
  state: AgentRunState;
  verdict?: string;
  error?: string;
}

const STATE_COLORS: Record<AgentRunState, string> = {
  pending: "text-text-secondary",
  running: "text-accent-cyan",
  done: "text-accent-emerald",
  error: "text-accent-red",
};

const STATE_LABEL: Record<AgentRunState, string> = {
  pending: "Queued",
  running: "Analyzing",
  done: "Complete",
  error: "Failed",
};

export function AgentStatus({ id, state, verdict, error }: Props) {
  const meta = AGENT_META[id];
  const isRunning = state === "running";

  return (
    <div
      className={`relative border border-border bg-bg-surface p-5 transition-all ${
        isRunning ? "scanline border-accent-cyan/40" : ""
      } ${state === "done" ? "border-accent-emerald/30" : ""} ${
        state === "error" ? "border-accent-red/30" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <span className="font-data text-xs text-text-secondary">
            {String(meta.number).padStart(2, "0")}
          </span>
          <h3 className="font-sans font-medium text-text-primary uppercase tracking-wider text-sm">
            {meta.name}
          </h3>
        </div>
        <span
          className={`text-[10px] uppercase tracking-[0.2em] font-data ${STATE_COLORS[state]}`}
        >
          {STATE_LABEL[state]}
        </span>
      </div>

      <div className="space-y-1.5 mb-3">
        <p className="text-[11px] text-text-secondary font-data">
          <span className="text-text-secondary/70">Framework: </span>
          {meta.framework}
        </p>
        <p className="text-[11px] text-text-secondary font-data">
          <span className="text-text-secondary/70">Data: </span>
          {meta.dataSources.join(" · ")}
        </p>
      </div>

      {state === "running" && (
        <div className="h-1 bg-bg-elevated overflow-hidden rounded-full">
          <div className="h-full bg-accent-cyan animate-pulse w-2/3" />
        </div>
      )}

      {state === "done" && verdict && (
        <p className="mt-3 text-sm text-text-primary/90 leading-relaxed border-t border-border pt-3">
          {verdict}
        </p>
      )}

      {state === "error" && (
        <p className="mt-3 text-xs text-accent-red/90 font-data leading-relaxed border-t border-accent-red/20 pt-3">
          {error ?? "Unknown error"}
        </p>
      )}
    </div>
  );
}
