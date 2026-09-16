"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { clearAuthData, getUser } from "@/lib/auth";
import { Users, Code2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import Topbar         from "@/components/dashboard/Topbar";
import FindMatchModal from "@/components/ui/FindMatchModal";
import SoloSection    from "@/components/dashboard/SoloSection";

export default function DashboardPage() {
  const router      = useRouter();
  const problemsRef = useRef(null);

  const [user,        setUser]        = useState(getUser());
  const [pageLoading, setPageLoading] = useState(true);
  const [modalOpen,   setModalOpen]   = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const data = await authApi.me();
        setUser(data.user);
      } catch {
        clearAuthData();
        router.replace("/login");
      } finally {
        setPageLoading(false);
      }
    };
    bootstrap();
  }, [router]);

  const handleSoloScroll = () => {
    if (problemsRef.current) {
      problemsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (pageLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg style={{ animation: "cm-spin 1s linear infinite", width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "Shubham";

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "#000",
          position: "relative",
          overflowX: "hidden",
          fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
        }}
      >

        {/* ─── BACKGROUND ATMOSPHERE ──────────────────────────── */}
        
        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 30%, transparent 100%)",
        }} />

        {/* Ambient blue glow centre */}
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "500px",
          background: "radial-gradient(ellipse, rgba(37,99,235,0.04) 0%, transparent 60%)",
          filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
        }} />

        {/* Edge glow top-right */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "400px", height: "300px",
          background: "radial-gradient(ellipse at top right, rgba(37,99,235,0.05) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Floating code fragments ─ top-left */}
        <pre style={{
          position: "absolute", top: "120px", left: "5%",
          fontFamily: "var(--font-geist-mono, monospace)", fontSize: "11px",
          color: "rgba(255,255,255,0.07)", lineHeight: "1.9", pointerEvents: "none",
          userSelect: "none", zIndex: 0,
        }}>{`// codeMate\nfunction match() {\n  return new Promise();\n}\n\nconst coder = {\n  passion: 'problem solving',\n  focus:   'consistency'\n};`}</pre>
        
        {/* </> fragments */}
        <span style={{ position:"absolute", top:"280px", left:"4%",   fontFamily:"monospace", fontSize:"13px", color:"rgba(255,255,255,0.08)", pointerEvents:"none", zIndex:0 }}>&lt;/&gt;</span>
        <span style={{ position:"absolute", top:"180px", right:"38%", fontFamily:"monospace", fontSize:"13px", color:"rgba(255,255,255,0.06)", pointerEvents:"none", zIndex:0 }}>{`{ }`}</span>
        <span style={{ position:"absolute", top:"230px", right:"44%", fontFamily:"monospace", fontSize:"13px", color:"rgba(255,255,255,0.06)", pointerEvents:"none", zIndex:0 }}>&lt;/&gt;</span>
        <span style={{ position:"absolute", top:"430px", left:"6%",   fontFamily:"monospace", fontSize:"13px", color:"rgba(255,255,255,0.07)", pointerEvents:"none", zIndex:0 }}>{`{ }`}</span>

        {/* Binary cluster ─ right */}
        <pre style={{
          position: "absolute", top: "300px", right: "7%",
          fontFamily: "monospace", fontSize: "11px", color: "rgba(255,255,255,0.07)",
          lineHeight: "1.9", textAlign: "right", pointerEvents: "none", userSelect: "none", zIndex: 0,
        }}>{`0 1 0 0 1\n0 1 0 0 1\n0 1 0 0 1\n0 1 0 0 1\n0 1 1`}</pre>
        <span style={{ position:"absolute", top:"270px", right:"5%", fontFamily:"monospace", fontSize:"13px", color:"rgba(255,255,255,0.07)", pointerEvents:"none", zIndex:0 }}>&lt;/&gt;</span>

        {/* Bottom-right terminal */}
        <pre style={{
          position: "absolute", bottom: "120px", right: "8%",
          fontFamily: "monospace", fontSize: "11px", color: "rgba(255,255,255,0.07)",
          lineHeight: "1.9", pointerEvents: "none", userSelect: "none", zIndex: 0,
        }}>{`while (true) {\n  code.learn.build.repeat();\n}`}</pre>
        <span style={{ position:"absolute", bottom:"155px", right:"38%", fontFamily:"monospace", fontSize:"13px", color:"rgba(255,255,255,0.06)", pointerEvents:"none", zIndex:0 }}>&lt;/&gt;</span>

        {/* SVG network nodes top-right */}
        <svg style={{ position:"absolute", top:"130px", right:"10%", width:"180px", height:"70px", pointerEvents:"none", zIndex:0 }} viewBox="0 0 180 70">
          <line x1="0" y1="35" x2="110" y2="35" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <line x1="110" y1="35" x2="165" y2="5"  stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <circle cx="0"   cy="35" r="2" fill="rgba(59,130,246,0.35)"/>
          <circle cx="110" cy="35" r="2" fill="rgba(59,130,246,0.35)"/>
          <circle cx="165" cy="5"  r="2.5" fill="rgba(59,130,246,0.7)"/>
        </svg>

        {/* SVG network nodes bottom-left */}
        <svg style={{ position:"absolute", bottom:"80px", left:"8%", width:"180px", height:"70px", pointerEvents:"none", zIndex:0 }} viewBox="0 0 180 70">
          <line x1="0"   y1="5"  x2="80"  y2="35" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <line x1="80"  y1="35" x2="180" y2="35" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          <circle cx="0"   cy="5"  r="2"   fill="rgba(59,130,246,0.35)"/>
          <circle cx="80"  cy="35" r="2"   fill="rgba(59,130,246,0.35)"/>
          <circle cx="180" cy="35" r="2.5" fill="rgba(59,130,246,0.7)"/>
        </svg>

        {/* ─── TOPBAR ─────────────────────────────────────────── */}
        <Topbar user={user} />

        {/* ─── HERO SECTION ───────────────────────────────────── */}
        <section
          style={{
            position: "relative", zIndex: 10,
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 68px)",
            padding: "80px 48px 100px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", width:"100%", maxWidth:"1100px" }}
          >
            {/* Heading */}
            <h1
              style={{
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.045em",
                lineHeight: 1.05,
                textAlign: "center",
                color: "#ffffff",
                margin: "0 0 24px 0",
                textShadow: "0 4px 40px rgba(255,255,255,0.07)",
              }}
            >
              Welcome back,&nbsp;{firstName}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.35rem)",
                color: "rgba(255,255,255,0.4)",
                textAlign: "center",
                fontWeight: 400,
                letterSpacing: "0.01em",
                margin: "0 0 72px 0",
              }}
            >
              Practice coding solo or get matched with a peer in real time.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex", gap: "24px", width: "100%",
                maxWidth: "760px", marginBottom: "32px",
              }}
            >
              {/* Find Match */}
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  flex: 1, height: "88px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "16px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(59,130,246,0.45)",
                  borderRadius: "18px",
                  cursor: "pointer",
                  color: "#fff",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  fontFamily: "inherit",
                  boxShadow: "0 0 40px rgba(37,99,235,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
                  transition: "all 200ms ease",
                  outline: "none",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(37,99,235,0.08)";
                  e.currentTarget.style.borderColor = "rgba(59,130,246,0.7)";
                  e.currentTarget.style.boxShadow = "0 0 60px rgba(37,99,235,0.18), inset 0 1px 0 rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.borderColor = "rgba(59,130,246,0.45)";
                  e.currentTarget.style.boxShadow = "0 0 40px rgba(37,99,235,0.1), inset 0 1px 0 rgba(255,255,255,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Users size={28} strokeWidth={1.5} />
                <span>Find Match</span>
              </button>

              {/* Solve Solo */}
              <button
                onClick={handleSoloScroll}
                style={{
                  flex: 1, height: "88px",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "16px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "18px",
                  cursor: "pointer",
                  color: "#fff",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  fontFamily: "inherit",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                  transition: "all 200ms ease",
                  outline: "none",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.04)";
                }}
              >
                <Code2 size={28} strokeWidth={1.5} />
                <span>Solve Solo</span>
              </button>
            </div>

            {/* Info Banner */}
            <div
              style={{
                width: "100%", maxWidth: "760px",
                padding: "16px 28px",
                background: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "14px",
                textAlign: "center",
                backdropFilter: "blur(12px)",
              }}
            >
              <span style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.35)", fontWeight: 400, letterSpacing: "0.01em" }}>
                Click Find Match to instantly connect with another coder.
              </span>
            </div>
          </motion.div>
        </section>

        {/* ─── PROBLEMS SECTION ────────────────────────────────── */}
        <section
          ref={problemsRef}
          style={{
            position: "relative", zIndex: 10,
            width: "100%",
            padding: "0 48px 140px",
          }}
        >
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <SoloSection />
          </div>
        </section>

      </div>

      <FindMatchModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
