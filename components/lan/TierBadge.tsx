import { tierColor, TIER_LABEL, type Tier } from "@/lib/lan";

export function TierBadge({ tier, size = "sm" }: { tier: Tier; size?: "sm" | "md" }) {
  const c = tierColor(tier);
  const sizeCls =
    size === "md" ? "text-[12px] px-2.5 py-1" : "text-[10px] px-2 py-0.5";
  return (
    <span
      className={`inline-flex items-center font-mono uppercase tracking-[0.08em] border rounded-sharp ${sizeCls} ${c.bg} ${c.text} ${c.border}`}
    >
      {TIER_LABEL[tier]}
    </span>
  );
}
