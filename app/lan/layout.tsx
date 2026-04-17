import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LAN V4 — Thaler Internal",
  robots: { index: false, follow: false },
};

export default function LanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
