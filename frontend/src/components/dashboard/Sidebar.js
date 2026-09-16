"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Swords,
  History,
  BookOpen,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Code2,
  Circle,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { clearAuthData } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, shortcut: "1" },
  { href: "/matches",   label: "Matches",   icon: Swords,          shortcut: "2" },
  { href: "/history",   label: "History",   icon: History,         shortcut: "3" },
  { href: "/problems",  label: "Problems",  icon: BookOpen,        shortcut: "4" },
  { href: "/settings",  label: "Settings",  icon: Settings,        shortcut: "5" },
];

export default function Sidebar({ user }) {
  const [collapsed, setCollapsed] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    clearAuthData();
    router.replace("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "CM";

  const W = collapsed ? "60px" : "220px";

  return (
    <aside
      style={{
        width: W,
        minWidth: W,
        background: "var(--cm-surface)",
        borderRight: "1px solid var(--cm-border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        transition: "width var(--cm-t-lg), min-width var(--cm-t-lg)",
        overflow: "hidden",
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* ── Logo ─────────────────────────────────────────────── */}
      <div
        style={{
          padding: collapsed ? "18px 0" : "18px 14px",
          display: "flex",
          alignItems: "center",
          gap: "9px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderBottom: "1px solid var(--cm-border)",
          minHeight: "58px",
          flexShrink: 0,
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "6px",
            background: "var(--cm-surface-3)",
            border: "1px solid var(--cm-border-3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Code2 size={14} color="var(--cm-text-1)" strokeWidth={2.5} />
        </div>

        {!collapsed && (
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.88rem",
              color: "var(--cm-text-1)",
              letterSpacing: "-0.03em",
              whiteSpace: "nowrap",
            }}
          >
            code<span style={{ color: "var(--cm-text-2)" }}>Mate</span>
          </span>
        )}
      </div>

      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav
        style={{
          flex: 1,
          padding: "16px 12px",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              title={collapsed ? label : undefined}
              className={`cm-nav-link${isActive ? " active" : ""}`}
              style={{
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "10px" : "8px 12px",
                borderRadius: "var(--cm-radius-md)",
              }}
            >
              <Icon
                size={16}
                strokeWidth={isActive ? 2 : 1.5}
                style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }}
              />
              {!collapsed && (
                <span style={{ flex: 1, whiteSpace: "nowrap" }}>{label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Bottom section ───────────────────────────────────── */}
      <div
        style={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          flexShrink: 0,
        }}
      >
        {/* User row */}
        {!collapsed ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px",
              marginBottom: "4px",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "var(--cm-surface-3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "var(--cm-text-1)",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "var(--cm-text-1)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  letterSpacing: "-0.01em",
                }}
              >
                {user?.name || "Developer"}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px", padding: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "var(--cm-surface-3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "var(--cm-text-1)",
              }}
            >
              {initials}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className="cm-nav-link"
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "10px" : "8px 12px",
            borderRadius: "var(--cm-radius-md)",
            color: "var(--cm-text-3)",
          }}
        >
          <LogOut size={16} strokeWidth={1.5} style={{ flexShrink: 0, opacity: 0.6 }} />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="cm-nav-link"
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "10px" : "8px 12px",
            borderRadius: "var(--cm-radius-md)",
            color: "var(--cm-text-3)",
          }}
        >
          {collapsed ? (
            <ChevronRight size={16} strokeWidth={1.5} style={{ opacity: 0.6 }} />
          ) : (
            <>
              <ChevronLeft size={16} strokeWidth={1.5} style={{ opacity: 0.6 }} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
