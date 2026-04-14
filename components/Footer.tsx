"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-border-subtle bg-bg-void">
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-[18px] text-text-primary hover:text-cyan transition-colors"
        >
          Thaler
        </Link>
        <div className="font-display italic text-[14px] text-text-secondary">
          Theory. Street. Data.
        </div>
        <div className="text-[11px] text-text-muted font-sans">
          Built with Claude by Anthropic
        </div>
      </div>
    </footer>
  );
}
