"use client";

import { fonts } from "@/lib/fonts";
import { useCountUp } from "@/lib/useCountUp";
import type { StatValue } from "@/data/portfolio";

interface ProjectStatsProps {
  stats: StatValue[];
}

function StatCard({ stat }: { stat: StatValue }) {
  const animated = useCountUp(stat.value);
  const text = `${stat.prefix ?? ""}${animated.toFixed(stat.decimals ?? 0)}${stat.suffix ?? ""}`;

  return (
    <div style={{ background: "#0d0f12", padding: "26px 24px" }}>
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: 34,
          color: "#f4f6f7",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          marginBottom: 10,
        }}
      >
        {text}
      </div>
      <div style={{ fontSize: 13, color: "#6b7178" }}>{stat.label}</div>
    </div>
  );
}

export default function ProjectStats({ stats }: ProjectStatsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        gap: 1,
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 56,
      }}
    >
      {stats.map((stat, i) => (
        <StatCard key={i} stat={stat} />
      ))}
    </div>
  );
}