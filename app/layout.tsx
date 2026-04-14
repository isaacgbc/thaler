import type { Metadata } from "next";
import { Instrument_Serif, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thaler — The Business Stress-Tester for the Post-AI Era",
  description:
    "Seven specialized AI economists stress-test any business against real macroeconomic, behavioral, and competitive conditions. Theory. Street. Data.",
  openGraph: {
    title: "Thaler",
    description: "Theory. Street. Data.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} bg-bg-primary`}
    >
      <body className="bg-bg-primary text-text-body antialiased">
        <div className="top-accent-bar" aria-hidden />
        {children}
      </body>
    </html>
  );
}
