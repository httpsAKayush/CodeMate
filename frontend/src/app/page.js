"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/lib/auth";

/* ─────────────────────────────────────────────────────────
   tiny utility: fade-in-up when element enters viewport
───────────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─────────────────────────────────────────────────────────
   Inline cursor blink
───────────────────────────────────────────────────────── */
function Cursor({ color, label, delay = "0s" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, verticalAlign: "middle", marginLeft: 2 }}>
      <span style={{
        display: "inline-block", width: 2, height: 13,
        background: color, borderRadius: 1,
        animation: `cm-blink 1.1s step-end ${delay} infinite`,
      }} />
      <span style={{
        fontFamily: "var(--font-geist-mono)", fontSize: 9, fontWeight: 600,
        color: "#fff", background: color,
        padding: "1px 5px", borderRadius: 3, lineHeight: 1.5,
        letterSpacing: "0.02em",
      }}>{label}</span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   Static syntax-highlighted code block
───────────────────────────────────────────────────────── */
const KW  = ({ c }) => <span style={{ color: "#c792ea" }}>{c}</span>;
const CLS = ({ c }) => <span style={{ color: "#82aaff" }}>{c}</span>;
const OP  = ({ c }) => <span style={{ color: "#89ddff" }}>{c}</span>;
const NUM = ({ c }) => <span style={{ color: "#f78c6c" }}>{c}</span>;
const CMT = ({ c }) => <span style={{ color: "#3f3f56" }}>{c}</span>;
const PL  = ({ c }) => <span style={{ color: "#d4d4d8" }}>{c}</span>;  /* plain */

function CodeBlock() {
  const LH = { display: "flex", alignItems: "center", lineHeight: "1.85", whiteSpace: "pre" };
  return (
    <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "#a1a1aa" }}>

      {/* line 1 */}
      <div style={LH}>
        <KW c="function" /> <span style={{ color: "#82aaff" }}> twoSum</span>
        <OP c="(" /><PL c="nums, target" /><OP c=")" /> <OP c="{" />
      </div>

      {/* line 2 */}
      <div style={LH}>
        <PL c="  " /><KW c="const " /> <PL c="map" /> <OP c=" = " /> <KW c="new " /> <CLS c="Map" /><OP c="()" /><OP c=";" />
        <Cursor color="#2563eb" label="You" delay="0s" />
      </div>

      {/* line 3 */}
      <div style={LH}>
        <PL c="  " /><KW c="for" /> <OP c="(" /><KW c="let" /> <PL c=" i" /> <OP c=" = " /> <NUM c="0" /><OP c=";" />
        <PL c=" i" /> <OP c="<" /> <PL c=" nums.length" /><OP c="; " /> <PL c="i" /><OP c="++" /><OP c=")" /> <OP c="{" />
      </div>

      {/* line 4 */}
      <div style={LH}>
        <PL c="    " /><KW c="const " /> <PL c="diff" /> <OP c=" = " /> <PL c="target" /> <OP c=" - " /> <PL c="nums" /><OP c="[" /><PL c="i" /><OP c="]" /><OP c=";" />
      </div>

      {/* line 5 */}
      <div style={LH}>
        <PL c="    " /><KW c="if" /> <OP c="(" /><PL c="map.has" /><OP c="(" /><PL c="diff" /><OP c="))" /> <KW c=" return" />
        <PL c=" [map.get" /><OP c="(" /><PL c="diff" /><OP c=")," /> <PL c="i" /><OP c="]" /><OP c=";" />
        <Cursor color="#7c3aed" label="Peer" delay="0.55s" />
      </div>

      {/* line 6 */}
      <div style={LH}>
        <PL c="    map.set" /><OP c="(" /><PL c="nums" /><OP c="[" /><PL c="i" /><OP c="]," /> <PL c="i" /><OP c=")" /><OP c=";" />
      </div>

      {/* line 7 */}
      <div style={LH}><PL c="  " /><OP c="}" /></div>

      {/* line 8 */}
      <div style={LH}><OP c="}" /></div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FEATURE CARD data
───────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    title: "Real-Time Matchmaking",
    desc: "Get matched with developers at your skill level in seconds. WebSocket-powered queue system with intelligent pairing.",
    tag: "Socket.io",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
      </svg>
    ),
    title: "Solo Practice Mode",
    desc: "41 handpicked algorithm problems. Filter by difficulty, topic, or drag to reorder. Monaco-powered editor.",
    tag: "Monaco Editor",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Multiplayer Coding Session",
    desc: "Join a shared coding room with another developer. See your partner's cursor in real time. First to pass all tests takes the session.",
    tag: "Yjs CRDT",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Live Code Sync",
    desc: "Sub-100ms code synchronisation via Yjs CRDT. Both users see every keystroke instantly, with zero conflicts.",
    tag: "<80ms latency",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M12 8v8"/>
      </svg>
    ),
    title: "Monaco Editor Experience",
    desc: "The same editor powering VS Code. Syntax highlighting, IntelliSense-style hints, and keyboard shortcuts.",
    tag: "VS Code Powered",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: "JWT Secured Sessions",
    desc: "Every coding session is protected with JWT authentication. Routes, rooms, and API calls are verified end-to-end.",
    tag: "Auth · Judge0",
  },
];

/* ─────────────────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  { initials: "AK", name: "aarav_k", text: "The real-time matchmaking is insane. Found an opponent in under 3 seconds and we both solved Two Sum together live.", color: "#2563eb" },
  { initials: "SR", name: "sara_r", text: "The Monaco editor is buttery smooth. Feels exactly like VS Code but with a live partner typing next to me.", color: "#7c3aed" },
  { initials: "MT", name: "m_tanaka", text: "Solo practice mode with drag-to-reorder problems is genuinely one of the best LeetCode UIs I've used.", color: "#0d9488" },
  { initials: "JD", name: "jaydev_d", text: "As someone preparing for FAANG, having live coding partners on demand is a total game changer.", color: "#b45309" },
];

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function Home() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const [matchState, setMatchState] = useState("idle"); // idle | searching | found

  /* auth redirect */
  useEffect(() => {
    if (getToken()) router.replace("/dashboard");
  }, [router]);



  /* canvas background */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [], frags = [], raf;
    const SNIPPETS = [
      "match()", "const room = uuid()", "socket.emit('join')", "JWT.verify()",
      "yjs.sync()", "twoSum([])", "judge0.run()", "{ }", "</>",
      "O(n log n)", "=> {}", "async/await", "WebSocket", "CRDT",
    ];
    const resize = () => {
      W = canvas.width = innerWidth;
      H = canvas.height = innerHeight;
    };
    const init = () => {
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.15, vy: -Math.random() * 0.12 - 0.03,
        r: Math.random() * 1.2 + 0.3, o: Math.random() * 0.28 + 0.04,
      }));
      frags = Array.from({ length: 22 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
        o: Math.random() * 0.032 + 0.007,
        vy: -(Math.random() * 0.065 + 0.015),
      }));
    };
    const drawGrid = () => {
      ctx.strokeStyle = "rgba(37,99,235,0.016)";
      ctx.lineWidth = 1;
      const g = 80;
      for (let x = 0; x < W; x += g) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += g) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    };
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
      drawGrid();
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147,197,253,${p.o})`; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      });
      ctx.font = `300 10.5px var(--font-geist-mono, monospace)`;
      frags.forEach(f => {
        ctx.fillStyle = `rgba(148,163,184,${f.o})`;
        ctx.fillText(f.text, f.x, f.y);
        f.y += f.vy;
        if (f.y < -20) { f.y = H + 20; f.x = Math.random() * W; f.text = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]; }
      });
      raf = requestAnimationFrame(tick);
    };
    resize(); init(); tick();
    window.addEventListener("resize", () => { resize(); init(); });
    return () => { cancelAnimationFrame(raf); };
  }, []);

  /* matchmaking animation */
  const startMatch = () => {
    setMatchState("searching");
    setTimeout(() => setMatchState("found"), 2800);
  };

  const hero = useReveal();
  const featuresReveal = useReveal();
  const matchReveal = useReveal();
  const soloReveal = useReveal();
  const testimonialReveal = useReveal();
  const ctaReveal = useReveal();



  return (
    <>
      {/* ── BACKGROUND ────────────────────────────────────────── */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, rgba(0,0,0,0.8) 100%), radial-gradient(ellipse 60% 70% at 0% 50%, rgba(0,0,0,0.55) 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 100% 50%, rgba(0,0,0,0.55) 0%, transparent 60%)",
      }} />
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse 45% 28% at 20% 35%, rgba(37,99,235,0.048) 0%, transparent 70%), radial-gradient(ellipse 38% 22% at 80% 65%, rgba(37,99,235,0.035) 0%, transparent 70%), radial-gradient(ellipse 55% 18% at 50% 100%, rgba(37,99,235,0.055) 0%, transparent 60%)",
      }} />

      {/* ── NAVBAR ────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px, 4vw, 56px)",
        background: "rgba(0,0,0,0.58)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <img src="/logo.png" alt="codeMate" style={{ width: 18, height: 18, objectFit: "contain" }} />
          <span style={{ fontSize: "0.92rem", fontWeight: 700, letterSpacing: "-0.025em", color: "#f4f4f5" }}>codeMate</span>
        </Link>


        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/login" style={navBtnStyle}>Login</Link>
          <Link href="/register" style={{ ...navBtnStyle, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.28)", color: "#60a5fa" }}>
            Get Started
          </Link>
        </div>
      </nav>

      <main style={{ position: "relative", zIndex: 10 }}>
        {/* ── HERO ──────────────────────────────────────────────── */}
        <section
          ref={hero.ref}
          style={{
            minHeight: "100vh",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,80px)",
            alignItems: "center",
            padding: "clamp(100px,12vw,140px) clamp(24px,6vw,80px) clamp(60px,8vw,100px)",
            maxWidth: 1400, margin: "0 auto",
            opacity: hero.visible ? 1 : 0,
            transform: hero.visible ? "none" : "translateY(28px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {/* left */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.18)", borderRadius: 100, marginBottom: 36 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563eb", boxShadow: "0 0 8px #2563eb", display: "inline-block", animation: "cm-pulse 2s ease infinite" }} />
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(96,165,250,0.9)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Live · Real-time matchmaking</span>
            </div>

            <h1 style={{
              fontFamily: "var(--font-geist-sans)", fontWeight: 800,
              fontSize: "clamp(40px,6vw,78px)", lineHeight: 1.0,
              letterSpacing: "-0.04em",
              background: "linear-gradient(180deg,#f4f4f5 0%,rgba(244,244,245,0.55) 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 24,
            }}>
              Code together,<br />Ace it together.
            </h1>

            <p style={{ fontSize: "clamp(14px,1.6vw,17px)", fontWeight: 300, color: "#71717a", lineHeight: 1.75, maxWidth: 420, marginBottom: 44 }}>
              Practice coding solo or get matched with developers in real time.
              Built with Monaco Editor, Socket.io, and Yjs for a seamless collaborative experience.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 52 }}>
              <Link href="/register" style={primaryBtnStyle}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Start Coding
              </Link>
              <a href="https://github.com/Shubham00097/CodeMate" target="_blank" rel="noreferrer" style={secondaryBtnStyle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
                View on GitHub
              </a>
            </div>

            {/* stats */}
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {[
                { label: "Real-time matchmaking", icon: "⚡" },
                { label: "Monaco editor powered", icon: "◈" },
                { label: "Learn together, live", icon: "⟷" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 13, color: "#2563eb", opacity: 0.8 }}>{s.icon}</span>
                  <span style={{ fontSize: 12, color: "#52525b", fontWeight: 400 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* right – editor mockup */}
          <div style={{ position: "relative" }}>
            <div style={editorCard}>
              {/* title bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["rgba(255,95,87,0.6)","rgba(255,189,46,0.6)","rgba(40,200,64,0.6)"].map((c,i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>twoSum.js — codeMate Room #a3f8</span>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(74,222,128,0.8)" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(74,222,128,1)", boxShadow: "0 0 6px rgba(74,222,128,0.8)", display: "inline-block", animation: "cm-pulse 1.5s ease infinite" }} />
                  LIVE
                </div>
              </div>

              {/* users */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Avatar letter="Y" color="#2563eb" />
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(96,165,250,0.85)" }}>You</span>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(74,222,128,0.7)", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", padding: "1px 6px", borderRadius: 4 }}>online</span>
                </div>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(255,255,255,0.18)" }}>⟷ synced · 42ms</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(192,132,252,0.7)", background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", padding: "1px 6px", borderRadius: 4 }}>online</span>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(216,180,254,0.85)" }}>Peer</span>
                  <Avatar letter="P" color="#7c3aed" />
                </div>
              </div>

              {/* tab bar */}
              <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
                <div style={{ padding: "8px 16px", fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#f4f4f5", borderBottom: "2px solid #2563eb", background: "rgba(255,255,255,0.03)" }}>solution.js</div>
                <div style={{ padding: "8px 16px", fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "rgba(255,255,255,0.28)" }}>test.js</div>
              </div>

              {/* code area */}
              <div style={{ display: "grid", gridTemplateColumns: "36px 1fr", minHeight: 200 }}>
                <div style={{ background: "rgba(0,0,0,0.25)", borderRight: "1px solid rgba(255,255,255,0.04)", padding: "14px 0" }}>
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <div key={n} style={{ padding: "0 8px", fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(255,255,255,0.12)", lineHeight: "1.85", textAlign: "right" }}>{n}</div>
                  ))}
                </div>
                <div style={{ padding: "14px 16px", overflowX: "auto" }}>
                  <CodeBlock />
                </div>
              </div>

              {/* terminal */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 14px", background: "rgba(0,0,0,0.35)", fontFamily: "var(--font-geist-mono)", fontSize: 10 }}>
                <div style={{ color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>TERMINAL</div>
                <div style={{ color: "rgba(74,222,128,0.85)" }}>▶ node solution.js</div>
                <div style={{ color: "rgba(255,255,255,0.4)" }}>✓ Test 1: [0,1] — 4ms</div>
                <div style={{ color: "rgba(255,255,255,0.4)" }}>✓ Test 2: [1,2] — 3ms</div>
                <div style={{ color: "rgba(251,191,36,0.7)" }}>⏳ Test 3: running…</div>
              </div>
            </div>

            {/* floating badge – Yjs only */}
            <FloatingBadge style={{ bottom: 56, right: 8 }} color="#7c3aed">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Yjs CRDT &middot; &lt;80ms latency
            </FloatingBadge>
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────────────── */}
        <section
          ref={featuresReveal.ref}
          style={{
            padding: "clamp(60px,8vw,120px) clamp(24px,6vw,80px)",
            width: "100%",
            maxWidth: "100vw",
            boxSizing: "border-box",
            opacity: featuresReveal.visible ? 1 : 0,
            transform: featuresReveal.visible ? "none" : "translateY(32px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
          }}
        >
          <div style={{ maxWidth: 1400, margin: "0 auto 48px" }}>
            <SectionLabel>Platform Features</SectionLabel>
            <h2 style={sectionHeadingStyle}>Everything you need to grow as a developer.</h2>
            <p style={sectionSubStyle}>A complete collaborative coding environment, built for real practice.</p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            width: "100%",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            borderLeft: "1px solid rgba(255,255,255,0.05)",
          }}>
            {FEATURES.map((f, i) => <FeatureCardFull key={i} {...f} />)}
          </div>
        </section>

        <SectionDivider />

        {/* ── MATCHMAKING SHOWCASE ──────────────────────────────── */}
        <section
          ref={matchReveal.ref}
          style={{
            padding: "clamp(80px,10vw,140px) clamp(24px,6vw,80px)",
            maxWidth: 1400, margin: "0 auto",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,80px)", alignItems: "center",
            opacity: matchReveal.visible ? 1 : 0,
            transform: matchReveal.visible ? "none" : "translateY(32px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div>
            <SectionLabel>Matchmaking</SectionLabel>
            <h2 style={sectionHeadingStyle}>Find an opponent in seconds.</h2>
            <p style={sectionSubStyle}>Our WebSocket-powered queue pairs you with a developer at your skill level. Pick a difficulty, select a topic, and we handle the rest.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 36 }}>
              {[
                { step: "01", label: "Select difficulty & topic" },
                { step: "02", label: "Join the matching queue" },
                { step: "03", label: "Get paired · enter live room" },
              ].map(s => (
                <div key={s.step} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(37,99,235,0.55)", letterSpacing: "0.1em" }}>{s.step}</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
                  <span style={{ fontSize: 13, color: "#71717a" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* match card */}
          <div style={{ ...panelCard, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Matchmaking Queue</span>
              {matchState === "found"
                ? <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(74,222,128,0.85)", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", padding: "2px 8px", borderRadius: 4 }}>Match Found</span>
                : matchState === "searching"
                  ? <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(251,191,36,0.85)", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", padding: "2px 8px", borderRadius: 4, animation: "cm-pulse 1s ease infinite" }}>Searching…</span>
                  : <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(255,255,255,0.25)", padding: "2px 8px", borderRadius: 4 }}>Idle</span>
              }
            </div>

            <div style={{ padding: 24 }}>
              {/* difficulty tags */}
              <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                {["Easy","Medium","Hard"].map(d => (
                  <span key={d} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, padding: "4px 12px", borderRadius: 6, background: d === "Medium" ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.03)", border: d === "Medium" ? "1px solid rgba(37,99,235,0.3)" : "1px solid rgba(255,255,255,0.07)", color: d === "Medium" ? "#60a5fa" : "#52525b" }}>{d}</span>
                ))}
              </div>

              {/* user vs user */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <UserCard letter="Y" name="You" status="ready" color="#2563eb" />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 16, color: "rgba(255,255,255,0.15)" }}>⚔</span>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(255,255,255,0.2)" }}>VS</span>
                </div>
                <UserCard letter={matchState === "found" ? "A" : "?"} name={matchState === "found" ? "alex_dev" : "Waiting…"} status={matchState === "found" ? "ready" : "searching"} color={matchState === "found" ? "#7c3aed" : "#3f3f46"} />
              </div>

              {matchState === "found" && (
                <div style={{ marginBottom: 16, padding: "8px 12px", background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 8, fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "rgba(74,222,128,0.8)", textAlign: "center" }}>
                  Match found · Two Sum · Medium · Starting in 3s
                </div>
              )}

              <button
                onClick={matchState === "idle" ? startMatch : undefined}
                style={{
                  width: "100%", padding: "12px 0", borderRadius: 8, border: "none", cursor: matchState !== "idle" ? "default" : "pointer",
                  background: matchState === "found" ? "rgba(74,222,128,0.12)" : "rgba(37,99,235,0.12)",
                  border: matchState === "found" ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(37,99,235,0.28)",
                  color: matchState === "found" ? "rgba(74,222,128,0.9)" : "#60a5fa",
                  fontFamily: "var(--font-geist-mono)", fontSize: 13, fontWeight: 500,
                  transition: "all 200ms ease",
                }}
              >
                {matchState === "idle" ? "▶ Try Demo Match" : matchState === "searching" ? "⏳ Finding opponent…" : "✓ Enter Room"}
              </button>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── SOLO PRACTICE SHOWCASE ────────────────────────────── */}
        <section
          ref={soloReveal.ref}
          style={{
            padding: "clamp(80px,10vw,140px) clamp(24px,6vw,80px)",
            maxWidth: 1400, margin: "0 auto",
            opacity: soloReveal.visible ? 1 : 0,
            transform: soloReveal.visible ? "none" : "translateY(32px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,80px)", alignItems: "center" }}>
            {/* problem list */}
            <div style={{ ...panelCard, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Solo Practice · 41 problems</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {["All","Easy","Medium","Hard"].map(f => (
                    <span key={f} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, padding: "2px 8px", borderRadius: 5, background: f === "All" ? "rgba(37,99,235,0.12)" : "transparent", border: f === "All" ? "1px solid rgba(37,99,235,0.25)" : "1px solid transparent", color: f === "All" ? "#60a5fa" : "rgba(255,255,255,0.25)", cursor: "pointer" }}>{f}</span>
                  ))}
                </div>
              </div>
              <div style={{ padding: "8px 0" }}>
                {[
                  { num: 1, title: "Two Sum", diff: "Easy", tags: ["Array","Hash Map"] },
                  { num: 2, title: "Longest Substring Without Repeating", diff: "Medium", tags: ["Sliding Window"] },
                  { num: 3, title: "Median of Two Sorted Arrays", diff: "Hard", tags: ["Binary Search"] },
                  { num: 4, title: "Valid Parentheses", diff: "Easy", tags: ["Stack"] },
                  { num: 5, title: "Merge Intervals", diff: "Medium", tags: ["Sorting","Array"] },
                ].map((p, i) => <ProblemRow key={i} {...p} />)}
                <div style={{ padding: "10px 16px", fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(255,255,255,0.15)", textAlign: "center" }}>+ 36 more problems</div>
              </div>
            </div>

            <div>
              <SectionLabel>Solo Practice</SectionLabel>
              <h2 style={sectionHeadingStyle}>Practice at your own pace.</h2>
              <p style={sectionSubStyle}>Browse 41 hand-curated algorithm problems. Filter by difficulty or topic. Drag to reorder your queue. Open any problem in the Monaco editor instantly.</p>
              <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
                <Link href="/dashboard" style={primaryBtnStyle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  Open Practice
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ── TESTIMONIALS ──────────────────────────────────────── */}
        <section
          ref={testimonialReveal.ref}
          style={{
            padding: "clamp(80px,10vw,140px) clamp(24px,6vw,80px)",
            maxWidth: 1400, margin: "0 auto",
            opacity: testimonialReveal.visible ? 1 : 0,
            transform: testimonialReveal.visible ? "none" : "translateY(32px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <SectionLabel>Community</SectionLabel>
          <h2 style={sectionHeadingStyle}>Loved by developers worldwide.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginTop: 52 }}>
            {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} {...t} />)}
          </div>
        </section>

        <SectionDivider />

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section
          ref={ctaReveal.ref}
          style={{
            padding: "clamp(80px,10vw,140px) clamp(24px,6vw,80px)",
            textAlign: "center", position: "relative", overflow: "hidden",
            opacity: ctaReveal.visible ? 1 : 0,
            transform: ctaReveal.visible ? "none" : "translateY(32px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: "radial-gradient(ellipse at center, rgba(37,99,235,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{
            fontFamily: "var(--font-geist-sans)", fontWeight: 700,
            fontSize: "clamp(28px,4vw,56px)", lineHeight: 1.08, letterSpacing: "-0.03em",
            background: "linear-gradient(180deg,#f4f4f5 0%,rgba(244,244,245,0.5) 100%)",
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            maxWidth: 640, margin: "0 auto 18px",
          }}>
            Build Together. Learn Together.<br />Grow Together.
          </h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: "#3f3f46", maxWidth: 380, margin: "0 auto", lineHeight: 1.7 }}>
            Real-time collaboration for the next generation of developers.
          </p>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{
        position: "relative", zIndex: 10,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(40px,6vw,72px) clamp(24px,6vw,80px) clamp(28px,4vw,48px)", display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 60, alignItems: "start" }}>
          {/* brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <img src="/logo.png" alt="codeMate" style={{ width: 16, height: 16, objectFit: "contain" }} />
              <span style={{ fontSize: "0.88rem", fontWeight: 700, letterSpacing: "-0.025em", color: "#f4f4f5" }}>codeMate</span>
            </div>
            <p style={{ fontSize: 12, color: "#3f3f46", lineHeight: 1.7, maxWidth: 220 }}>Real-time collaborative coding platform built for developers.</p>
          </div>
          {/* links */}
          {[
            { heading: "Platform", links: ["Features","Practice","Matchmaking","Leaderboard"] },
            { heading: "Resources", links: ["GitHub","Docs","Contact"] },
            { heading: "Legal", links: ["Privacy","Terms"] },
          ].map(col => (
            <div key={col.heading}>
              <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>{col.heading}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ fontSize: 12, color: "#3f3f46", textDecoration: "none", transition: "color 120ms ease" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#71717a"}
                    onMouseLeave={e => e.currentTarget.style.color = "#3f3f46"}
                  >{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px clamp(24px,6vw,80px)", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(255,255,255,0.16)", letterSpacing: "0.04em" }}>Built with Next.js · Socket.io · Monaco · Yjs</span>
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(255,255,255,0.13)", letterSpacing: "0.04em" }}>Enter Dashboard &nbsp;·&nbsp; Start Solo Practice &nbsp;·&nbsp; © 2026 codeMate</span>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes cm-pulse { 0%,100%{opacity:1}50%{opacity:0.35} }
        @keyframes cm-blink { 0%,100%{opacity:1}50%{opacity:0} }
        @keyframes cm-fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }

        /* hero responsive */
        @media(max-width:900px){
          section[style*="grid-template-columns: 1fr 1fr"]{
            grid-template-columns:1fr!important;
          }
          nav > div:nth-child(2){display:none!important}
        }
        @media(max-width:600px){
          footer > div:first-child{
            grid-template-columns:1fr!important;
            gap:28px!important;
          }
        }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────── */

function NavLink({ href, label }) {
  return (
    <a href={href} style={navBtnStyle}
      onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.38)"; e.currentTarget.style.background = "transparent"; }}
    >{label}</a>
  );
}

function Avatar({ letter, color }) {
  return (
    <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${color}30`, border: `1px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color, flexShrink: 0 }}>
      {letter}
    </div>
  );
}

function FloatingBadge({ children, style, color }) {
  return (
    <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "rgba(0,0,0,0.75)", border: `1px solid ${color}25`, borderRadius: 8, backdropFilter: "blur(12px)", fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap", ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(37,99,235,0.6)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18 }}>
      {children}
    </div>
  );
}

function SectionDivider() {
  return <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(255,255,255,0.055),transparent)", maxWidth: 1400, margin: "0 auto" }} />;
}

function FeatureCard({ icon, title, desc, tag }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "24px 22px",
        background: hov ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.014)",
        border: hov ? "1px solid rgba(37,99,235,0.18)" : "1px solid rgba(255,255,255,0.05)",
        borderRadius: 10,
        boxShadow: hov ? "0 0 30px rgba(37,99,235,0.06)" : "none",
        transform: hov ? "translateY(-2px)" : "none",
        transition: "all 180ms cubic-bezier(0.4,0,0.2,1)",
        cursor: "default",
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", marginBottom: 16 }}>
        {icon}
      </div>
      <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#e4e4e7", marginBottom: 8, letterSpacing: "-0.01em" }}>{title}</div>
      <p style={{ fontSize: 12.5, color: "#52525b", lineHeight: 1.7, marginBottom: 16 }}>{desc}</p>
      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(37,99,235,0.55)", background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.14)", padding: "2px 8px", borderRadius: 5 }}>{tag}</span>
    </div>
  );
}

function FeatureCardFull({ icon, title, desc, tag }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "40px 36px",
        background: hov ? "rgba(37,99,235,0.04)" : "rgba(0,0,0,0)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        transition: "background 200ms cubic-bezier(0.4,0,0.2,1)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* subtle blue corner glow on hover */}
      {hov && (
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: 120, height: 120,
          background: "radial-gradient(ellipse at top left, rgba(37,99,235,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      )}
      <div style={{ width: 38, height: 38, borderRadius: 9, background: hov ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.07)", border: `1px solid rgba(37,99,235,${hov ? 0.22 : 0.12})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", marginBottom: 20, transition: "all 200ms ease", position: "relative", zIndex: 1 }}>
        {icon}
      </div>
      <div style={{ fontSize: "0.92rem", fontWeight: 600, color: hov ? "#f4f4f5" : "#e4e4e7", marginBottom: 10, letterSpacing: "-0.015em", position: "relative", zIndex: 1, transition: "color 150ms ease" }}>{title}</div>
      <p style={{ fontSize: 13, color: "#52525b", lineHeight: 1.75, marginBottom: 20, position: "relative", zIndex: 1 }}>{desc}</p>
      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(37,99,235,0.5)", background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.12)", padding: "3px 9px", borderRadius: 5, position: "relative", zIndex: 1 }}>{tag}</span>
    </div>
  );
}

function UserCard({ letter, name, status, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color, boxShadow: status === "ready" ? `0 0 16px ${color}22` : "none" }}>{letter}</div>
      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: status === "ready" ? "#a1a1aa" : "#3f3f46" }}>{name}</span>
      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: status === "ready" ? "rgba(74,222,128,0.8)" : "rgba(251,191,36,0.7)", background: status === "ready" ? "rgba(74,222,128,0.07)" : "rgba(251,191,36,0.07)", border: status === "ready" ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(251,191,36,0.2)", padding: "2px 7px", borderRadius: 4 }}>
        {status === "ready" ? "Ready" : "Waiting…"}
      </span>
    </div>
  );
}

function ProblemRow({ num, title, diff, tags }) {
  const [hov, setHov] = useState(false);
  const diffColor = diff === "Easy" ? { c: "#15b740", bg: "rgba(21,183,64,0.08)", border: "rgba(21,183,64,0.2)" }
    : diff === "Medium" ? { c: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" }
    : { c: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" };
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 16px", background: hov ? "rgba(255,255,255,0.02)" : "transparent", cursor: "default", transition: "background 120ms ease" }}
    >
      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "rgba(255,255,255,0.18)", minWidth: 22, textAlign: "right" }}>{num}</span>
      <span style={{ flex: 1, fontSize: 12.5, color: hov ? "#e4e4e7" : "#a1a1aa", transition: "color 120ms ease", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        {tags.map(t => <span key={t} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 4 }}>{t}</span>)}
      </div>
      <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, color: diffColor.c, background: diffColor.bg, border: `1px solid ${diffColor.border}`, padding: "2px 8px", borderRadius: 5, flexShrink: 0 }}>{diff}</span>
    </div>
  );
}

function TestimonialCard({ initials, name, text, color }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "22px 20px",
        background: hov ? "rgba(255,255,255,0.022)" : "rgba(255,255,255,0.012)",
        border: hov ? `1px solid ${color}22` : "1px solid rgba(255,255,255,0.05)",
        borderRadius: 10,
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? `0 0 24px ${color}12` : "none",
        transition: "all 200ms cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color }}>{initials}</div>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#52525b" }}>@{name}</span>
      </div>
      <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.7, fontWeight: 300 }}>&ldquo;{text}&rdquo;</p>
    </div>
  );
}

/* ── Shared style objects ── */
const navBtnStyle = {
  display: "inline-flex", alignItems: "center",
  padding: "6px 14px",
  background: "transparent", border: "1px solid transparent", borderRadius: 7,
  color: "rgba(255,255,255,0.38)",
  fontFamily: "var(--font-geist-sans)", fontSize: "0.8rem", fontWeight: 400,
  textDecoration: "none", cursor: "pointer",
  transition: "all 120ms cubic-bezier(0.4,0,0.2,1)",
};

const primaryBtnStyle = {
  display: "inline-flex", alignItems: "center", gap: 8,
  padding: "11px 22px",
  background: "rgba(37,99,235,0.12)",
  border: "1px solid rgba(37,99,235,0.3)",
  borderRadius: 8,
  color: "#60a5fa",
  fontFamily: "var(--font-geist-sans)", fontSize: "0.85rem", fontWeight: 500,
  textDecoration: "none", cursor: "pointer",
  transition: "all 180ms cubic-bezier(0.4,0,0.2,1)",
  boxShadow: "0 0 20px rgba(37,99,235,0.1)",
};

const secondaryBtnStyle = {
  display: "inline-flex", alignItems: "center", gap: 8,
  padding: "11px 22px",
  background: "rgba(255,255,255,0.035)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  color: "#71717a",
  fontFamily: "var(--font-geist-sans)", fontSize: "0.85rem", fontWeight: 400,
  textDecoration: "none", cursor: "pointer",
  transition: "all 180ms cubic-bezier(0.4,0,0.2,1)",
};

const editorCard = {
  background: "rgba(8,8,8,0.92)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(37,99,235,0.05)",
};

const panelCard = {
  background: "rgba(255,255,255,0.014)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: 10,
  boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
};

const sectionHeadingStyle = {
  fontFamily: "var(--font-geist-sans)", fontWeight: 700,
  fontSize: "clamp(24px,3vw,42px)", lineHeight: 1.1,
  letterSpacing: "-0.03em",
  background: "linear-gradient(180deg,#f4f4f5 0%,rgba(244,244,245,0.58) 100%)",
  WebkitBackgroundClip: "text", backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: 16,
};

const sectionSubStyle = {
  fontSize: "clamp(13px,1.4vw,15px)", fontWeight: 300,
  color: "#52525b", lineHeight: 1.75, maxWidth: 480,
};
