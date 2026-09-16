"use client";

import { useEffect, useState } from "react";
import { Users, Clock, Radio, ArrowUpRight } from "lucide-react";

function useLiveValue(base, variance, intervalMs) {
  const [value, setValue] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setValue(base + Math.floor((Math.random() * 2 - 1) * variance));
    }, intervalMs);
    return () => clearInterval(id);
  }, [base, variance, intervalMs]);
  return value;
}

/* Mini wait-time sparkline — static decorative bars */
const SPARKLINE = [30, 42, 38, 55, 45, 50, 44];

export default function MatchmakingCard() {
  const online = useLiveValue(247, 12, 4000);
  const rooms = useLiveValue(14, 3, 5000);

  const stats = [
    {
      icon: Users,
      value: online.toLocaleString(),
      label: "online now",
      id: "online-users",
    },
    {
      icon: Clock,
      value: "~45s",
      label: "avg wait time",
      id: "avg-wait",
      sparkline: true,
    },
    {
      icon: Radio,
      value: rooms,
      label: "active rooms",
      id: "active-rooms",
    },
  ];

  return (
    <div
      className="cm-card"
      style={{ padding: "0", overflow: "hidden" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p className="cm-section-label">Live Lobby</p>
          <span className="cm-pulse-dot" />
        </div>
      </div>

      {/* Stat blocks */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          padding: "0 24px 24px",
        }}
      >
        {stats.map(({ icon: Icon, value, label, id, sparkline }) => {
          const isLive = id === "online-users";

          return (
            <div
              key={id}
              id={id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1,
                background: "var(--cm-surface-2)",
                padding: "16px",
                borderRadius: "var(--cm-radius-md)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    padding: "8px",
                    background: isLive ? "var(--cm-success-bg)" : "var(--cm-secondary-dim)",
                    borderRadius: "var(--cm-radius-sm)",
                    border: isLive ? "1px solid var(--cm-success-dim)" : "1px solid var(--cm-secondary-bg)",
                  }}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.8}
                    color={isLive ? "var(--cm-success-text)" : "var(--cm-secondary-text)"}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "var(--cm-text-1)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--cm-text-3)",
                      marginTop: "6px",
                    }}
                  >
                    {label}
                  </p>
                </div>
              </div>

              {/* Sparkline for wait time block */}
              {sparkline && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "3px",
                    height: "20px",
                  }}
                >
                  {SPARKLINE.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: "4px",
                        height: `${(h / 60) * 20}px`,
                        background: i === SPARKLINE.length - 1
                          ? "var(--cm-secondary-text)"
                          : "var(--cm-secondary-dim)",
                        borderRadius: "2px",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
