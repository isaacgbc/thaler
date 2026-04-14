// Clamp an arbitrary-scale survival modifier to integer [-20, +20].
export function clampModifier(m: unknown): number {
  const n = typeof m === "number" ? m : Number(m);
  if (!Number.isFinite(n)) return 0;
  // If agent emitted 0..1 (like 0.78), scale to 0..20. If -1..1, scale to -20..20.
  // If already ±20ish range, leave it. Heuristic:
  const abs = Math.abs(n);
  let v = n;
  if (abs > 0 && abs <= 1) v = n * 20;
  else if (abs > 1 && abs <= 5) v = n * 4; // 2.5 → 10
  if (v > 20) v = 20;
  if (v < -20) v = -20;
  return Math.round(v);
}

// Strip model-emitted citation tags like <cite index="41-5">…</cite>.
export function stripCiteTags(s: unknown): string {
  if (typeof s !== "string") return "";
  return s
    .replace(/<\/?cite[^>]*>/gi, "")
    .replace(/<\/?sup[^>]*>/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// First complete sentence of arbitrary text (for one-line verdicts).
export function firstSentence(s: unknown): string {
  const t = stripCiteTags(s);
  if (!t) return "";
  const match = t.match(/^[^.!?]{8,320}[.!?]/);
  if (match) return match[0].trim();
  return t.length > 200 ? t.slice(0, 200).trim() + "…" : t;
}

export function modifierTone(
  m: number
): "good" | "bad" | "warn" | "neutral" {
  if (m >= 8) return "good";
  if (m >= 3) return "warn";
  if (m <= -8) return "bad";
  if (m <= -3) return "warn";
  return "neutral";
}

export function scoreTone(score: number): "good" | "warn" | "bad" {
  if (score >= 75) return "good";
  if (score >= 50) return "warn";
  return "bad";
}

export function formatUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${Math.round(n).toLocaleString()}`;
}
