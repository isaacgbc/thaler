import { COUNTRY_NAMES } from "@/lib/lan";

export function CountryFlag({
  code,
  showName = false,
}: {
  code: string;
  showName?: boolean;
}) {
  const c = COUNTRY_NAMES[code];
  if (!c) return <span className="font-mono text-text-muted">{code}</span>;
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[12px]">
      <span className="text-[14px] leading-none">{c.flag}</span>
      <span className="text-text-body">{showName ? c.name : code}</span>
    </span>
  );
}
