"use client";

import { Trophy, Users2, Bookmark, Target } from "lucide-react";

const STATS = [
  {
    icon: Trophy,
    label: "Matches Completed",
    value: "31",
    trend: "↑ +4 this week",
    trendUp: true,
  },
  {
    icon: Users2,
    label: "Partner Problems",
    value: "58",
    trend: "↑ +7 this week",
    trendUp: true,
  },
  {
    icon: Bookmark,
    label: "Favorite Topic",
    value: "Graphs",
    trend: "→ 12 solved",
    trendUp: null,
  },
  {
    icon: Target,
    label: "Win Rate",
    value: "73%",
    trend: "↑ +5% vs last month",
    trendUp: true,
  },
];

export default function StatsGrid() {
  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <p className="cm-section-label">Your Stats</p>
        <span
          style={{
            fontSize: "0.7rem",
            color: "var(--cm-text-4)",
            letterSpacing: "-0.005em",
          }}
        >
          All time
        </span>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {STATS.map(({ icon: Icon, label, value, trend, trendUp }) => (
          <StatCard
            key={label}
            Icon={Icon}
            label={label}
            value={value}
            trend={trend}
            trendUp={trendUp}
          />
        ))}
      </div>
    </div>
  );
}

function StatCard({ Icon, label, value, trend, trendUp }) {
  return (
    <div
      className="cm-card cm-card-hover"
      style={{ padding: "20px 22px", cursor: "default" }}
    >
      {/* Icon */}
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "var(--cm-radius-sm)",
          background: "var(--cm-secondary-dim)",
          border: "1px solid var(--cm-secondary-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <Icon size={14} strokeWidth={1.8} color="var(--cm-secondary-text)" />
      </div>

      {/* Value */}
      <p
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "var(--cm-text-1)",
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        {value}
      </p>

      {/* Label */}
      <p
        style={{
          fontSize: "0.76rem",
          color: "var(--cm-text-3)",
          fontWeight: 500,
          marginTop: "6px",
          letterSpacing: "-0.005em",
        }}
      >
        {label}
      </p>

      {/* Trend */}
      <p
        style={{
          fontSize: "0.7rem",
          color: trendUp === true
            ? "var(--cm-success-text)"
            : trendUp === false
              ? "var(--cm-text-3)"
              : "var(--cm-secondary-text)",
          fontWeight: 500,
          marginTop: "10px",
          letterSpacing: "-0.005em",
        }}
      >
        {trend}
      </p>
    </div>
  );
}
