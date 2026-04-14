import type { Config } from "tailwindcss";

// Thaler Design System — Light-mode consulting palette
// Token names kept identical to prior dark-mode palette so existing Tailwind
// classes (bg-bg-void, text-text-primary, border-border-subtle, bg-cyan,
// text-positive, etc.) remap to light-mode colors without component changes.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          void: "#FAFAF9",       // warm-white page bg
          surface: "#FFFFFF",    // cards
          elevated: "#F5F4F1",   // alt sections / hover
          input: "#FFFFFF",
          accent: "#F0EFEB",
          primary: "#FAFAF9",
        },
        border: {
          DEFAULT: "#E8E6E1",
          subtle: "#E8E6E1",
          active: "#D4D1CA",
          focus: "#1A6B4E",
        },
        text: {
          primary: "#1A1A1A",
          body: "#3D3D3D",
          secondary: "#6B6B6B",
          muted: "#9B9B9B",
          inverse: "#FFFFFF",
        },
        cyan: {
          DEFAULT: "#1A6B4E",
          dim: "#134E3A",
          light: "#E8F5EE",
        },
        positive: {
          DEFAULT: "#1A6B4E",
          dim: "#134E3A",
          light: "#E8F5EE",
        },
        warning: {
          DEFAULT: "#B5850A",
          dim: "#7C5A07",
          light: "#FFF9E6",
        },
        danger: {
          DEFAULT: "#C4372A",
          dim: "#8F281E",
          light: "#FFF0EE",
        },
        theory: {
          DEFAULT: "#5B4A9E",
          dim: "#3F336E",
          light: "#F3F0FF",
        },
        accent: {
          cyan: "#1A6B4E",
          amber: "#B5850A",
          red: "#C4372A",
          emerald: "#1A6B4E",
          violet: "#5B4A9E",
        },
      },
      fontFamily: {
        display: ["var(--font-serif)", "Georgia", "serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        data: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sharp: "3px",
      },
      spacing: {
        section: "80px",
      },
      maxWidth: {
        editorial: "800px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.06)",
      },
      lineHeight: {
        body: "1.7",
      },
    },
  },
  plugins: [],
};

export default config;
