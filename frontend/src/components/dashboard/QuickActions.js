"use client";

import { Swords, History, Code2, ArrowRight } from "lucide-react";

const SECONDARY_ACTIONS = [
  { icon: History,  label: "View History",   hint: "⌘H" },
  { icon: Code2,    label: "Practice Solo",   hint: "⌘P" },
];

export default function QuickActions({ onFindMatch }) {
  return (
    <div
      className="cm-card"
      style={{
        padding: "22px 20px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top Section */}
      <div>
        <p className="cm-section-label" style={{ marginBottom: "16px" }}>
          Quick Actions
        </p>

        {/* Primary CTA */}
        <button
          id="find-match-btn"
          onClick={onFindMatch}
          className="cm-btn cm-btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            padding: "12px 16px",
            fontSize: "0.88rem",
            fontWeight: 700,
            borderRadius: "var(--cm-radius-md)",
            letterSpacing: "-0.02em",
          }}
        >
          <Swords size={15} strokeWidth={2.2} />
          Find Match
        </button>
      </div>

      {/* Secondary actions — vertical list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "12px" }}>
        {SECONDARY_ACTIONS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="cm-btn cm-btn-ghost"
            style={{
              width: "100%",
              justifyContent: "flex-start",
              fontSize: "0.82rem",
              padding: "10px 12px",
              borderRadius: "var(--cm-radius-sm)",
              color: "var(--cm-text-3)",
            }}
          >
            <Icon size={14} strokeWidth={1.8} style={{ flexShrink: 0, opacity: 0.7 }} />
            <span style={{ flex: 1, fontWeight: 500 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
