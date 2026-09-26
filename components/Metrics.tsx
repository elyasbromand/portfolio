"use client";

import { useRef } from "react";
import { fonts } from "@/lib/fonts";
import { hackathon } from "@/data/portfolio";
import { useCountUp } from "@/lib/useCountUp";
import type { GithubStats } from "@/lib/github";
import styles from "./Metrics.module.css";

interface MetricsProps {
  stats: GithubStats;
}

const SPARK_VIEWBOX_WIDTH = 260;
const SPARK_VIEWBOX_HEIGHT = 44;

interface SparkPoint {
  x: number;
  y: number;
}

function buildSparkPoints(spark: number[]): SparkPoint[] {
  if (spark.length < 2) return [];
  const min = Math.min(...spark);
  const max = Math.max(...spark);
  const range = max - min || 1;
  const n = spark.length;
  return spark.map((v, i) => ({
    x: (i / (n - 1)) * SPARK_VIEWBOX_WIDTH,
    y: SPARK_VIEWBOX_HEIGHT - 2 - ((v - min) / range) * 38,
  }));
}

const statLabelStyle: React.CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 12,
  color: "#6b7178",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  marginBottom: 14,
};

const statValueStyle: React.CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 600,
  fontSize: "clamp(26px, 8vw, 40px)",
  color: "#f4f6f7",
  lineHeight: 1,
  letterSpacing: "-0.02em",
  fontVariantNumeric: "tabular-nums",
};

const statSubStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7178",
  marginTop: 8,
};

export default function Metrics({ stats }: MetricsProps) {
  // One shared trigger for all three counters: the cards always enter the
  // viewport together as a single row, so there's no need for a ref per card.
  const gridRef = useRef<HTMLDivElement>(null);
  const publicRepos = useCountUp(stats.publicRepos, { ref: gridRef });
  const contributions = useCountUp(stats.contributions, { ref: gridRef });
  const starsEarned = useCountUp(stats.starsEarned, { ref: gridRef });

  const sparkPoints = buildSparkPoints(stats.recentActivity);

  return (
    <section style={{ padding: "8px 0 64px" }}>
      <div ref={gridRef} className={styles.grid}>
        <div className={styles.card}>
          <div style={statLabelStyle}>Public repos</div>
          <div style={statValueStyle}>{Math.round(publicRepos)}</div>
          <div style={statSubStyle}>owned, not forked</div>
        </div>

        <div className={styles.card}>
          <div
            style={{
              ...statLabelStyle,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Contributions
            <span
              title="refreshed hourly from GitHub"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#7ee787",
                animation: "blink 1.6s infinite",
              }}
            />
          </div>
          <div style={statValueStyle}>{Math.round(contributions)}</div>
          {sparkPoints.length ? (
            <svg
              viewBox={`0 0 ${SPARK_VIEWBOX_WIDTH} ${SPARK_VIEWBOX_HEIGHT}`}
              preserveAspectRatio="none"
              style={{ width: "100%", height: 32, marginTop: 12, display: "block" }}
            >
              <polyline
                points={sparkPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
                fill="none"
                stroke="#7ee787"
                strokeWidth={1.6}
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={0.9}
                pathLength={100}
                style={{
                  strokeDasharray: 100,
                  animation: "sparkDraw 4s ease-out infinite",
                }}
              />
              <circle
                cx={sparkPoints[sparkPoints.length - 1].x}
                cy={sparkPoints[sparkPoints.length - 1].y}
                r={2.6}
                fill="#7ee787"
                style={{ animation: "blink 1.6s infinite, sparkDotIn 4s ease-out infinite" }}
              />
            </svg>
          ) : (
            <div style={statSubStyle}>all-time</div>
          )}
        </div>

        <div className={styles.card}>
          <div style={statLabelStyle}>Stars earned on GitHub</div>
          <div style={statValueStyle}>{Math.round(starsEarned)}</div>
          <div style={statSubStyle}>across public repos</div>
        </div>

        <div className={styles.card}>
          <div style={statLabelStyle}>International hackathon win</div>
          <div style={statValueStyle}>1</div>
          <div style={statSubStyle}>
            {hackathon.host} · {hackathon.challenge}
          </div>
        </div>
      </div>
    </section>
  );
}
