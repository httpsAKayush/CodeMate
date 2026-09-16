"use client";

export default function Topbar({ user }) {
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "CM";

  return (
    <header
      style={{
        height: "56px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* ── Logo ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            width: "18px",
            height: "18px",
            objectFit: "contain",
          }}
        />
        <span
          style={{
            fontSize: "0.92rem",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "#f4f4f5",
            fontFamily: "inherit",
          }}
        >
          codeMate
        </span>
      </div>

      {/* ── Avatar ───────────────────────────────────────────── */}
      <div
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.68rem",
          fontWeight: 700,
          color: "#a1a1aa",
          cursor: "pointer",
          userSelect: "none",
          letterSpacing: "0.04em",
          flexShrink: 0,
          transition: "border-color 120ms, background 120ms",
        }}
        title={user?.name || "Profile"}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          e.currentTarget.style.background = "rgba(255,255,255,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        }}
      >
        {initials}
      </div>
    </header>
  );
}
