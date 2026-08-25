"use client";

import { useEffect, useRef, useState } from "react";
import { fonts } from "@/lib/fonts";
import { metricTargets } from "@/data/portfolio";

interface MetricsState {
  reqs: number;
  p99: number;
  uptime: number;
  services: number;
  spark: number[];
}

const SPARK_MIN = 28;
const SPARK_MAX = 58;
const SPARK_VIEWBOX_WIDTH = 260;
const SPARK_VIEWBOX_HEIGHT = 44;

function formatReqs(reqs: number): string {
  return reqs >= 1e6
    ? (reqs / 1e6).toFixed(1) + "M"
    : Math.round(reqs).toLocaleString();
}

function buildSparkPoints(spark: number[]): string {
  const arr = spark.length ? spark : [40];
  const n = arr.length;
  return arr
    .map((v, i) => {
      const x = (i / (n - 1 || 1)) * SPARK_VIEWBOX_WIDTH;
      const y =
        SPARK_VIEWBOX_HEIGHT -
        2 -
        ((v - SPARK_MIN) / (SPARK_MAX - SPARK_MIN)) * 38;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
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
  fontSize: 40,
  color: "#f4f6f7",
  lineHeight: 1,
  letterSpacing: "-0.02em",
};

const statSubStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7178",
  marginTop: 8,
};

const statCardStyle: React.CSSProperties = {
  background: "#0d0f12",
  padding: "28px 26px",
};

export default function Metrics() {
  const [state, setState] = useState<MetricsState>({
    reqs: 0,
    p99: 0,
    uptime: 0,
    services: 0,
    spark: [],
  });

  const sparkIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    let frame: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = ease(t);
      setState((s) => ({
        ...s,
        reqs: metricTargets.reqs * e,
        p99: metricTargets.p99 * e,
        uptime: metricTargets.uptime * e,
        services: metricTargets.services * e,
      }));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    // seed + live latency sparkline
    const seed = Array.from({ length: 28 }, () => 34 + Math.random() * 18);
    setState((s) => ({ ...s, spark: seed }));

    sparkIntervalRef.current = setInterval(() => {
      setState((s) => {
        const next = s.spark.slice(1);
        next.push(30 + Math.random() * 26);
        const live = 38 + Math.round(Math.random() * 10);
        return { ...s, spark: next, p99: live };
      });
    }, 1600);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(sparkIntervalRef.current);
    };
  }, []);

  const reqsText = formatReqs(state.reqs);
  const p99Text = String(Math.round(state.p99));
  const uptimeText = state.uptime.toFixed(2);
  const servicesText = String(Math.round(state.services));
  const sparkPoints = buildSparkPoints(state.spark);

  return (
    <section style={{ padding: "8px 0 64px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 1,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Requests / day</div>
          <div style={statValueStyle}>{reqsText}</div>
          <div style={statSubStyle}>across owned services</div>
        </div>

        <div style={statCardStyle}>
          <div
            style={{
              ...statLabelStyle,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            p99 latency
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#7ee787",
                animation: "blink 1.6s infinite",
              }}
            />
          </div>
          <div style={statValueStyle}>
            {p99Text}
            <span style={{ fontSize: 20, color: "#6b7178" }}>ms</span>
          </div>
          <svg
            viewBox={`0 0 ${SPARK_VIEWBOX_WIDTH} ${SPARK_VIEWBOX_HEIGHT}`}
            preserveAspectRatio="none"
            style={{ width: "100%", height: 32, marginTop: 12, display: "block" }}
          >
            <polyline
              points={sparkPoints}
              fill="none"
              stroke="#7ee787"
              strokeWidth={1.6}
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={0.9}
            />
          </svg>
        </div>

        <div style={statCardStyle}>
          <div style={statLabelStyle}>Uptime (12mo)</div>
          <div style={statValueStyle}>
            {uptimeText}
            <span style={{ fontSize: 20, color: "#6b7178" }}>%</span>
          </div>
          <div style={statSubStyle}>rolling SLO across prod</div>
        </div>

        <div style={statCardStyle}>
          <div style={statLabelStyle}>Services owned</div>
          <div style={statValueStyle}>{servicesText}</div>
          <div style={statSubStyle}>from schema to on-call</div>
        </div>
      </div>
    </section>
  );
}
