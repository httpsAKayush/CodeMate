"use client";

import { useMemo } from "react";

/* ── Constants ─────────────────────────────────────────────────────────────── */
const WEEKS = 52;
const DAYS_PER_WEEK = 7;
const TOTAL_CELLS = WEEKS * DAYS_PER_WEEK;

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/* Slate-blue (low) to Orange (high) intensity for graph */
function cellColor(val) {
  if (val === 0) return "rgba(83, 86, 83, 0.54)";
  if (val <= 3)  return "rgba(14, 55, 7, 0.98)";   /* Orange soft */
  if (val <= 6)  return " #20610cff";  /* Orange solid */
  return          "rgba(21, 183, 64, 0.77)"; // Deeper orange for highest
}

/* Deterministic pseudo-random data — fully seeded, no Math.random() */
function lcg(seed) {
  // Linear congruential generator
  return ((seed * 1664525 + 1013904223) & 0xffffffff) >>> 0;
}

function generateData(total) {
  const data = [];
  let seed = 0xdeadbeef;
  for (let i = 0; i < total; i++) {
    seed = lcg(seed + i);
    const rng = (seed / 0xffffffff); // 0..1
    const dayOfWeek = i % 7;
    const weekend = dayOfWeek === 0 || dayOfWeek === 6;
    const max = weekend ? 2 : 8;
    // ~30% chance of zero (no activity)
    const active = ((lcg(seed ^ 0xabcd) / 0xffffffff) > 0.3) ? 1 : 0;
    data.push(active === 0 ? 0 : Math.round(rng * max));
  }
  return data;
}

export default function ActivityGraph() {
  const data = useMemo(() => generateData(TOTAL_CELLS), []);

  /* Total contributions */
  const total = useMemo(() => data.reduce((a, b) => a + b, 0), [data]);

  /* Month labels: figure out which week each month starts in */
  const monthLabels = useMemo(() => {
    const today = new Date();
    const labels = [];
    for (let w = 0; w < WEEKS; w++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (WEEKS - w) * 7);
      if (date.getDate() <= 7) {
        labels.push({ week: w, label: MONTH_NAMES[date.getMonth()] });
      }
    }
    return labels;
  }, []);

  return (
    <div className="cm-card" style={{ padding: "22px 24px" }}>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--cm-text-2)",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: "var(--cm-text-1)",
                fontSize: "1rem",
              }}
            >
              {total}
            </span>{" "}
            problems solved in the last year
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{
                fontSize: "0.65rem",
                color: "var(--cm-text-4)",
                letterSpacing: "-0.005em",
                marginRight: "2px",
              }}
            >
              Less
            </span>
            {[
              "rgba(83, 86, 83, 0.54)",
              " rgba(14, 55, 7, 0.98)",
              " #20610cff",
              " rgba(21, 183, 64, 0.77)",
            ].map((color, i) => (
              <div
                key={i}
                style={{
                  width: "11px",
                  height: "11px",
                  borderRadius: "2px",
                  background: color,
                }}
              />
            ))}
            <span
              style={{
                fontSize: "0.65rem",
                color: "var(--cm-text-4)",
                letterSpacing: "-0.005em",
                marginLeft: "2px",
              }}
            >
              More
            </span>
          </div>
        </div>
      </div>

      {/* Grid wrapper with day-of-week labels */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>

        {/* Day-of-week labels column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            paddingTop: "20px", /* align with month label row */
            flexShrink: 0,
          }}
        >
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              style={{
                height: "11px",
                fontSize: "0.6rem",
                color: "var(--cm-text-4)",
                fontFamily: "var(--font-geist-mono)",
                lineHeight: "11px",
                width: "22px",
                textAlign: "right",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Heatmap columns */}
        <div style={{ flex: 1, overflowX: "auto" }}>
          {/* Month labels row */}
          <div
            style={{
              display: "flex",
              height: "18px",
              marginBottom: "2px",
              position: "relative",
            }}
          >
            {monthLabels.map(({ week, label }) => (
              <div
                key={`${week}-${label}`}
                style={{
                  position: "absolute",
                  left: `${week * 14}px`,
                  fontSize: "0.62rem",
                  color: "var(--cm-text-4)",
                  fontFamily: "var(--font-geist-mono)",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Week columns */}
          <div
            style={{
              display: "flex",
              gap: "3px",
              minWidth: `${WEEKS * 14}px`,
            }}
          >
            {Array.from({ length: WEEKS }).map((_, w) => (
              <div
                key={w}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                }}
              >
                {Array.from({ length: DAYS_PER_WEEK }).map((_, d) => {
                  const idx = w * DAYS_PER_WEEK + d;
                  const val = data[idx] ?? 0;
                  return (
                    <div
                      key={d}
                      className="cm-heat-cell"
                      title={`${val} problem${val !== 1 ? "s" : ""} solved`}
                      style={{ background: cellColor(val) }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
