"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  score: number; // 0-100
  label?: string;
  size?: number;
}

// Semicircular speedometer gauge. Arc from -90° (left, 0%) to 90° (right, 100%).
// Gradient ticks: red (0-40), amber (40-65), green (65-100). Animated needle sweep.
export function SurvivalGauge({ score, label = "Survival probability", size = 360 }: Props) {
  const clamped = Math.max(0, Math.min(100, score));
  const ref = useRef<HTMLDivElement | null>(null);
  const [animated, setAnimated] = useState(0);

  // Intersection observer — trigger the sweep when gauge enters the viewport.
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            // Start from 0 and animate to final value
            const start = performance.now();
            const duration = 1200;
            const from = 0;
            const to = clamped;
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
              setAnimated(from + (to - from) * eased);
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [clamped]);

  const cx = size / 2;
  const cy = size / 2 + 20;
  const r = size / 2 - 30;
  const strokeW = 20;

  // Convert 0-100 to angle -90..90 degrees (left to right over the top)
  const valueToAngle = (v: number) => -90 + (v / 100) * 180;
  const angle = valueToAngle(animated);

  // Helper: polar → cartesian
  const polar = (deg: number, radius: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
  };

  // Build arc segments by color band
  const arc = (startPct: number, endPct: number, stroke: string) => {
    const a0 = valueToAngle(startPct);
    const a1 = valueToAngle(endPct);
    const [x0, y0] = polar(a0 + 90, r);
    const [x1, y1] = polar(a1 + 90, r);
    const large = a1 - a0 > 180 ? 1 : 0;
    return (
      <path
        d={`M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`}
        stroke={stroke}
        strokeWidth={strokeW}
        fill="none"
        strokeLinecap="butt"
      />
    );
  };

  // Needle line endpoint
  const [nx, ny] = polar(angle + 90, r - 8);

  // Determine color of the score number from final score, not animation
  const color =
    clamped >= 65 ? "var(--positive)" : clamped >= 40 ? "var(--warning)" : "var(--danger)";

  return (
    <div ref={ref} className="flex flex-col items-center">
      <svg
        width={size}
        height={size / 2 + 60}
        viewBox={`0 0 ${size} ${size / 2 + 60}`}
        role="img"
        aria-label={`${label} ${Math.round(clamped)} percent`}
      >
        {/* Track base */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke="var(--border-subtle)"
          strokeWidth={strokeW}
          fill="none"
        />
        {/* Color bands */}
        {arc(0, 40, "var(--danger)")}
        {arc(40, 65, "var(--warning)")}
        {arc(65, 100, "var(--positive)")}

        {/* Tick marks every 10 */}
        {Array.from({ length: 11 }, (_, i) => {
          const a = valueToAngle(i * 10);
          const [x0, y0] = polar(a + 90, r - strokeW / 2 - 4);
          const [x1, y1] = polar(a + 90, r - strokeW / 2 - 12);
          return (
            <line
              key={i}
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              stroke="var(--text-muted)"
              strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
              opacity={0.55}
            />
          );
        })}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          style={{ transition: "x2 0.05s linear, y2 0.05s linear" }}
        />
        {/* Needle hub */}
        <circle cx={cx} cy={cy} r={9} fill="var(--bg-elevated)" stroke={color} strokeWidth={2} />
      </svg>

      <div
        className="font-data font-semibold tabular-nums leading-none mt-2"
        style={{ fontSize: "84px", color }}
      >
        {Math.round(animated)}%
      </div>
      <div className="mt-4 text-[15px] text-text-secondary font-sans">
        {label}
      </div>
    </div>
  );
}
