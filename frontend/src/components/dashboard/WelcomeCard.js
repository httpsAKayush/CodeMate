"use client";

import { Flame, Swords, Target } from "lucide-react";

const STATS = [
  {
    icon: Flame,
    value: "14",
    label: "Day Streak",
  },
  {
    icon: Swords,
    value: "128",
    label: "Total Matches",
  },
  {
    icon: Target,
    value: "73%",
    label: "Win Rate",
  },
];

export default function WelcomeCard({ user, style }) {
  const firstName = user?.name?.split(" ")[0] || "Developer";

  return (
    <div
      className="cm-card"
      style={{
        padding: "28px 32px",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Subtle background glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle at top left, var(--cm-success-bg) 0%, var(--cm-secondary-dim) 50%, transparent 80%)",
          pointerEvents: "none",
          opacity: 0.6,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left: heading block */}
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--cm-text-1)",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Welcome back,{" "}
            <span style={{ color: "var(--cm-text-2)" }}>
              {firstName}
            </span>
          </h1>
          <p
            style={{
              marginTop: "6px",
              fontSize: "0.85rem",
              color: "var(--cm-text-3)",
              letterSpacing: "-0.01em",
            }}
          >
            Ready to match? Your last session was 2 days ago.
          </p>
        </div>

        {/* Right: stat pills */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  padding: "6px",
                  background: "var(--cm-secondary-dim)",
                  borderRadius: "var(--cm-radius-sm)",
                  border: "1px solid var(--cm-secondary-bg)",
                }}
              >
                <Icon
                  size={14}
                  strokeWidth={1.8}
                  style={{ color: "var(--cm-secondary-text)", flexShrink: 0, display: "block" }}
                />
              </div>
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--cm-text-1)",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.7rem",
                    color: "var(--cm-text-3)",
                    marginTop: "3px",
                  }}
                >
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
