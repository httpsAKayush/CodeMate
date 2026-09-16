"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { clearAuthData, getToken } from "@/lib/auth";
import { authApi, sessionApi } from "@/lib/api";
import VideoCallPanel from "@/components/VideoCallPanel";
import * as Y from "yjs";
import { toast } from "react-hot-toast";

export default function SessionPage() {
  const { id: sessionId } = useParams();
  const router = useRouter();
  const isSolo = sessionId.startsWith("solo-");

  // ── Core state ─────────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Editor ─────────────────────────────────────────────────────────────────
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const selectedLanguageRef = useRef("cpp");
  useEffect(() => {
    selectedLanguageRef.current = selectedLanguage;
  }, [selectedLanguage]);

  const [code, setCode] = useState("");
  const editorRef = useRef(null);

  // Yjs CRDT stable instances
  const ydocRef = useRef(null);
  const bindingRef = useRef(null);

  if (!ydocRef.current) {
    ydocRef.current = new Y.Doc();
  }

  // ── Chat ───────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);
  const [isRequestingHint, setIsRequestingHint] = useState(false);

  // ── Console / run ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("chat");
  const [consoleOutput, setConsoleOutput] = useState("No execution run yet.");
  const [isRunning, setIsRunning] = useState(false);
  const [executionReport, setExecutionReport] = useState(null);

  // ── Video panel ────────────────────────────────────────────────────────────
  const [callState, setCallState] = useState("idle"); // idle | incoming | connected
  const [peerOnline, setPeerOnline] = useState(true);

  // ── Exit Modal ─────────────────────────────────────────────────────────────
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // ── Socket ref (passed down to VideoCallPanel) ─────────────────────────────
  const socketRef = useRef(null);

  // ── Derived ────────────────────────────────────────────────────────────────
  const peerUser = sessionData?.users?.find(u => u._id !== user?._id);
  const problem = sessionData?.problem || {};
  const peerNameRef = useRef("Partner");

  useEffect(() => {
    if (peerUser) {
      peerNameRef.current = peerUser.name;
    }
  }, [peerUser]);

  // ═══ Load user + session ══════════════════════════════════════════════════
  useEffect(() => {
    const init = async () => {
      try {
        const { user: me } = await authApi.me();
        const { session } = await sessionApi.getSession(sessionId);
        setUser(me);
        setSessionData(session);

        // Set starter code only if Yjs text is empty
        const ytext = ydocRef.current.getText("monaco");
        if (ytext.toString() === "") {
          const peer = session.users?.find(u => String(u._id) !== String(me._id));
          const isInitializer = !peer || String(me._id) < String(peer._id);
          if (isInitializer) {
            const initialCode = session.problem?.starterCode?.["cpp"] ?? "// Start coding here";
            ytext.insert(0, initialCode);
            setCode(initialCode);
          }
        } else {
          setCode(ytext.toString());
        }
      } catch (err) {
        setError(err.message || "Failed to load session.");
        if (/authorized|token/i.test(err.message)) {
          clearAuthData();
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [sessionId, router]);

  // ═══ Socket: code sync + chat + peer status ═══════════════════════════════
  useEffect(() => {
    const token = getToken();
    if (!token || !sessionId) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      auth: { token },
    });
    socketRef.current = socket;

    const ydoc = ydocRef.current;

    // Listen to local Yjs document changes and stream updates over socket
    const handleYjsUpdate = (update, origin) => {
      if (origin !== "socket") {
        socket.emit("code_change", { 
          sessionId, 
          update: Array.from(update) 
        });
      }
    };
    ydoc.on("update", handleYjsUpdate);

    socket.on("connect", () => {
      socket.emit("join_session", sessionId);
      // Request latest Yjs state from other peer when connecting
      socket.emit("yjs_sync_req", sessionId);
    });

    socket.on("code_update", (updateArray) => {
      const update = new Uint8Array(updateArray);
      Y.applyUpdate(ydoc, update, "socket");
      setCode(ydoc.getText("monaco").toString());
    });

    socket.on("yjs_sync_req", ({ socketId }) => {
      console.log("Relaying Yjs state to newly connected peer:", socketId);
      const update = Y.encodeStateAsUpdate(ydoc);
      socket.emit("yjs_sync_res", { 
        targetSocketId: socketId, 
        update: Array.from(update),
        language: selectedLanguageRef.current
      });
    });

    socket.on("yjs_sync_res", ({ update: updateArray, language }) => {
      console.log("Synchronized Yjs document state from peer!");
      const update = new Uint8Array(updateArray);
      Y.applyUpdate(ydoc, update, "socket");
      setCode(ydoc.getText("monaco").toString());
      if (language) {
        setSelectedLanguage(language);
      }
    });

    socket.on("language_update", ({ language }) => {
      setSelectedLanguage(language);
    });

    socket.on("chat_update", (msg) => {
      if (msg.text && msg.text.startsWith("🤖 **[AI HINT]** ")) {
        const cleanText = msg.text.replace("🤖 **[AI HINT]** ", "");
        setMessages(prev => [
          ...prev,
          {
            userId: "gemini-ai",
            userName: "Gemini Assistant",
            text: cleanText,
            timestamp: msg.timestamp || new Date()
          }
        ]);
        setActiveTab("chat");
      } else {
        setMessages(prev => [...prev, msg]);
      }
    });

    socket.on("peer_status", ({ status }) => {
      setPeerOnline(status === "online");
      if (status === "offline") {
        setCallState("idle");
        toast(`${peerNameRef.current} left the session`, { style: { background: "#1C1D21", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" } });
      }
    });

    socket.on("call_signal", ({ type }) => {
      if (type === "request") {
        setCallState("incoming");
      } else if (type === "accept") {
        setCallState("connected");
      } else if (type === "reject" || type === "end") {
        setCallState("idle");
      }
    });

    return () => {
      socket.off("connect");
      socket.off("code_update");
      socket.off("yjs_sync_req");
      socket.off("yjs_sync_res");
      socket.off("chat_update");
      socket.off("peer_status");
      socket.off("call_signal");
      ydoc.off("update", handleYjsUpdate);
      socket.emit("leave_session", sessionId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId]);

  // ═══ Editor handlers ══════════════════════════════════════════════════════
  const handleEditorDidMount = async (editor) => {
    editorRef.current = editor;
    
    // Dynamically import y-monaco to avoid SSR "window is not defined" crash
    const { MonacoBinding } = await import("y-monaco");

    // Bind Yjs to Monaco
    const ydoc = ydocRef.current;
    const ytext = ydoc.getText("monaco");
    
    if (bindingRef.current) {
      bindingRef.current.destroy();
    }
    
    const binding = new MonacoBinding(
      ytext,
      editor.getModel(),
      new Set([editor])
    );
    bindingRef.current = binding;
  };

  const handleEditorChange = (value) => {
    if (ydocRef.current) {
      setCode(ydocRef.current.getText("monaco").toString());
    }
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    const newCode = sessionData?.problem?.starterCode?.[lang];
    if (newCode && ydocRef.current) {
      const ytext = ydocRef.current.getText("monaco");
      ydocRef.current.transact(() => {
        ytext.delete(0, ytext.length);
        ytext.insert(0, newCode);
      });
      setCode(newCode);
    }
    socketRef.current?.emit("language_change", { sessionId, language: lang });
  };

  // ═══ Chat ═════════════════════════════════════════════════════════════════
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = { userId: user?._id, userName: user?.name, text: chatInput, timestamp: new Date() };
    setMessages(prev => [...prev, msg]);
    socketRef.current?.emit("chat_message", { sessionId, text: chatInput });
    setChatInput("");
  };

  // ═══ Code execution ═══════════════════════════════════════════════════════
  const handleRunCode = async () => {
    setIsRunning(true); setActiveTab("console");
    setExecutionReport(null); setConsoleOutput("Submitting to Judge0…");
    const currentCode = ydocRef.current ? ydocRef.current.getText("monaco").toString() : code;
    try {
      const report = await sessionApi.runCode(sessionId, { code: currentCode, language: selectedLanguage });
      setExecutionReport(report);
    } catch (err) {
      setConsoleOutput(`Error: ${err.message}`);
    } finally { setIsRunning(false); }
  };

  const handleSubmitCode = async () => {
    setIsRunning(true); setActiveTab("console");
    setExecutionReport(null); setConsoleOutput("Submitting solution…");
    const currentCode = ydocRef.current ? ydocRef.current.getText("monaco").toString() : code;
    try {
      const report = await sessionApi.submitSolution(sessionId, { code: currentCode, language: selectedLanguage });
      setExecutionReport(report);
    } catch (err) {
      setConsoleOutput(`Error: ${err.message}`);
    } finally { setIsRunning(false); }
  };

  const handleRequestHint = async () => {
    setIsRequestingHint(true);
    setActiveTab("chat");
    const currentCode = ydocRef.current ? ydocRef.current.getText("monaco").toString() : code;
    try {
      const response = await sessionApi.getHint(sessionId, { code: currentCode, language: selectedLanguage });
      const hintText = response.hint || "No hint generated. Try again!";
      
      const aiMsg = {
        userId: "gemini-ai",
        userName: "Gemini Assistant",
        text: hintText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);

      socketRef.current?.emit("chat_message", {
        sessionId,
        text: `🤖 **[AI HINT]** ${hintText}`
      });
    } catch (err) {
      const errMsg = {
        userId: "gemini-ai",
        userName: "Gemini Assistant",
        text: `Failed to request AI hint: ${err.message || "Unknown error"}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsRequestingHint(false);
    }
  };

  // ═══ Call Signaling ═══════════════════════════════════════════════════════
  const startCall = () => {
    socketRef.current?.emit("call_signal", { sessionId, type: "request" });
    setCallState("connected");
  };

  const acceptCall = () => {
    socketRef.current?.emit("call_signal", { sessionId, type: "accept" });
    setCallState("connected");
  };

  const rejectCall = () => {
    socketRef.current?.emit("call_signal", { sessionId, type: "reject" });
    setCallState("idle");
  };

  const endCall = () => {
    socketRef.current?.emit("call_signal", { sessionId, type: "end" });
    setCallState("idle");
  };

  // ═══ Loading / Error screens ══════════════════════════════════════════════
  if (loading) return (
    <div style={{
      height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: "16px", background: "#080909", color: "#fff",
      fontFamily: "var(--font-geist-sans),sans-serif"
    }}>
      <svg style={{ animation: "cm-spin 1s linear infinite", width: 24, height: 24 }}
        viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <p style={{ fontSize: "14px", color: "#88888F" }}>Loading workspace…</p>
    </div>
  );

  if (error) return (
    <div style={{
      height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: "20px", background: "#080909", color: "#fff", padding: "24px",
      fontFamily: "var(--font-geist-sans),sans-serif"
    }}>
      <div style={{
        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
        padding: "24px", borderRadius: "12px", maxWidth: "480px", textAlign: "center"
      }}>
        <h2 style={{ fontSize: "18px", color: "#EF4444", marginBottom: "12px" }}>Workspace Error</h2>
        <p style={{ fontSize: "14px", color: "#88888F", marginBottom: "20px" }}>{error}</p>
        <button onClick={() => router.push("/dashboard")}
          style={{
            background: "#fff", color: "#000", border: "none", padding: "10px 20px",
            borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500"
          }}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  // ═══ Main Layout ══════════════════════════════════════════════════════════
  return (
    <div style={{
      height: "100vh", width: "100%", display: "flex", flexDirection: "column",
      background: "#080909", color: "#fff",
      fontFamily: "var(--font-geist-sans),-apple-system,sans-serif", overflow: "hidden"
    }}>

      {/* ── Exit Confirmation Modal ── */}
      {showExitConfirm && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <div style={{
            background: "#111214", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px", padding: "24px", width: "320px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: 600 }}>Exit Session?</h3>
            <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#A1A1AA" }}>
              Do you want to exit the current session?
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowExitConfirm(false)} style={{
                flex: 1, padding: "8px 0", borderRadius: "6px",
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff", fontSize: "14px", fontWeight: 500, cursor: "pointer"
              }}>
                Cancel
              </button>
              <button onClick={() => router.push("/dashboard")} style={{
                flex: 1, padding: "8px 0", borderRadius: "6px",
                background: "#EF4444", border: "none",
                color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer"
              }}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Header ── */}
      <header style={{
        height: "56px", borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "#0C0C0E", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 20px", flexShrink: 0
      }}>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => setShowExitConfirm(true)} style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "transparent", border: "none", cursor: "pointer",
            color: "#EF4444", fontSize: "13px", fontWeight: "600"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Exit
          </button>
          <span style={{ height: "16px", width: "1px", background: "rgba(255,255,255,0.12)" }} />
          <span style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "-0.01em" }}>
            codeMate Workspace
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {problem.difficulty && (
            <span style={{
              fontSize: "11px", fontWeight: "600", textTransform: "uppercase",
              letterSpacing: "0.05em", padding: "4px 8px", borderRadius: "4px",
              background: problem.difficulty.toLowerCase() === "easy" ? "rgba(34,197,94,0.15)"
                : problem.difficulty.toLowerCase() === "medium" ? "rgba(202,138,4,0.15)" : "rgba(239,68,68,0.15)",
              color: problem.difficulty.toLowerCase() === "easy" ? "#22c55e"
                : problem.difficulty.toLowerCase() === "medium" ? "#ca8a04" : "#ef4444",
              border: `1px solid ${problem.difficulty.toLowerCase() === "easy" ? "rgba(34,197,94,0.2)"
                : problem.difficulty.toLowerCase() === "medium" ? "rgba(202,138,4,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}>{problem.difficulty}</span>
          )}
          {problem.topic && (
            <span style={{
              fontSize: "11px", fontWeight: "600", textTransform: "uppercase",
              letterSpacing: "0.05em", padding: "4px 8px", borderRadius: "4px",
              background: "rgba(255,255,255,0.06)", color: "#A1A1AA",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              {problem.topic}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {!isSolo && (
            <>
              {callState !== "connected" ? (
                <button onClick={startCall} disabled={!peerOnline} style={{
                  display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px",
                  background: peerOnline ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${peerOnline ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "6px", color: peerOnline ? "#10B981" : "#A1A1AA",
                  fontSize: "12px", fontWeight: "500", cursor: peerOnline ? "pointer" : "not-allowed", outline: "none"
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Start Call
                </button>
              ) : (
                <button onClick={endCall} style={{
                  display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px",
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "6px", color: "#EF4444",
                  fontSize: "12px", fontWeight: "500", cursor: "pointer", outline: "none"
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.21 2.2z" />
                  </svg>
                  End Call
                </button>
              )}

              <div style={{
                display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "6px"
              }}>
                <span style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: peerOnline ? "#10B981" : "#88888F"
                }} />
                <span style={{ fontSize: "12px", fontWeight: "500", color: "#E4E4E7" }}>
                  Partner: {peerUser?.name || "…"}
                </span>
                <span style={{ fontSize: "11px", color: "#88888F" }}>
                  ({peerOnline ? "Online" : "Offline"})
                </span>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── Workspace Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* Left pane: Problem */}
        <section style={{
          width: "42%", borderRight: "1px solid rgba(255,255,255,0.08)",
          display: "flex", flexDirection: "column", background: "#09090B", overflowY: "auto"
        }}>
          <div style={{ padding: "28px" }}>
            <h2 style={{
              fontSize: "20px", fontWeight: "600", letterSpacing: "-0.02em",
              marginBottom: "16px"
            }}>{problem.title}</h2>
            <div style={{
              whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: "1.6",
              color: "#D4D4D8", marginBottom: "28px"
            }}>{problem.description}</div>

            {problem.constraints?.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <h4 style={{
                  fontSize: "12px", fontWeight: "600", textTransform: "uppercase",
                  letterSpacing: "0.05em", color: "#A1A1AA", marginBottom: "10px"
                }}>Constraints</h4>
                <ul style={{ paddingLeft: "18px", margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                  {problem.constraints.map((c, i) => (
                    <li key={i} style={{ fontSize: "13px", color: "#A1A1AA", fontFamily: "monospace" }}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {problem.examples?.length > 0 && (
              <div>
                <h4 style={{
                  fontSize: "12px", fontWeight: "600", textTransform: "uppercase",
                  letterSpacing: "0.05em", color: "#A1A1AA", marginBottom: "12px"
                }}>Examples</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {problem.examples.map((ex, i) => (
                    <div key={i} style={{
                      background: "#0C0C0E", border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "8px", padding: "14px"
                    }}>
                      <div style={{ fontSize: "11px", color: "#88888F", marginBottom: "6px" }}>Example {i + 1}</div>
                      <div style={{ fontSize: "13px", fontFamily: "monospace", color: "#E4E4E7", marginBottom: "4px" }}>
                        <span style={{ color: "#88888F" }}>Input: </span>{ex.input}
                      </div>
                      <div style={{ fontSize: "13px", fontFamily: "monospace", color: "#E4E4E7" }}>
                        <span style={{ color: "#88888F" }}>Output: </span>{ex.output}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right split: Editor + Chat/Console */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

          {/* Code Editor */}
          <section style={{
            height: "60%", borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "#080909", display: "flex", flexDirection: "column", overflow: "hidden"
          }}>

            {/* Editor toolbar */}
            <div style={{
              height: "44px", borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "#0C0C0E", display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "0 16px", flexShrink: 0
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#88888F" }}>Language:</span>
                <select value={selectedLanguage} onChange={e => handleLanguageChange(e.target.value)}
                  style={{
                    background: "#050506", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "6px", color: "#fff", fontSize: "12px", padding: "4px 8px",
                    outline: "none", cursor: "pointer"
                  }}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <button onClick={() => { if (confirm("Reset editor?")) handleLanguageChange(selectedLanguage); }}
                style={{
                  background: "transparent", border: "none", color: "#88888F",
                  fontSize: "12px", cursor: "pointer"
                }}>
                Reset template
              </button>
            </div>

            {/* Monaco */}
            <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
              <Editor height="100%" language={selectedLanguage} theme="vs-dark"
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false }, fontSize: 14, lineNumbers: "on",
                  scrollBeyondLastLine: false, automaticLayout: true,
                  padding: { top: 16, bottom: 16 }, cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  fontFamily: "var(--font-geist-mono),monospace", tabSize: 4
                }} />
            </div>

            {/* Run / Submit footer */}
            <div style={{
              height: "48px", borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "#0C0C0E", display: "flex", alignItems: "center",
              justifyContent: "flex-end", padding: "0 16px", gap: "12px", flexShrink: 0
            }}>
              <button onClick={handleRequestHint} disabled={isRequestingHint || isRunning}
                style={{
                  marginRight: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)",
                  border: "1px solid rgba(139, 92, 246, 0.4)",
                  boxShadow: "0 0 10px rgba(139, 92, 246, 0.1)",
                  borderRadius: "6px",
                  padding: "6px 14px",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#D8B4FE",
                  cursor: (isRequestingHint || isRunning) ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease-in-out",
                  opacity: (isRequestingHint || isRunning) ? 0.6 : 1,
                  outline: "none"
                }}
                onMouseEnter={e => {
                  if (!isRequestingHint && !isRunning) {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)";
                    e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.6)";
                    e.currentTarget.style.boxShadow = "0 0 15px rgba(139, 92, 246, 0.3)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isRequestingHint && !isRunning) {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)";
                    e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.4)";
                    e.currentTarget.style.boxShadow = "0 0 10px rgba(139, 92, 246, 0.1)";
                  }
                }}
              >
                {isRequestingHint ? (
                  <>
                    <svg style={{ animation: "cm-spin 1s linear infinite", width: 14, height: 14 }}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <span>Thinking…</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    </svg>
                    <span>Ask Gemini ✨</span>
                  </>
                )}
              </button>
              <button onClick={handleRunCode} disabled={isRunning}
                style={{
                  background: "rgba(255,255,255,0.04)", color: "#fff",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px",
                  padding: "6px 14px", fontSize: "13px", fontWeight: "500", cursor: "pointer"
                }}>
                {isRunning ? "Running…" : "Run Code"}
              </button>
              <button onClick={handleSubmitCode} disabled={isRunning}
                style={{
                  background: "#fff", color: "#000", border: "none", borderRadius: "6px",
                  padding: "6px 14px", fontSize: "13px", fontWeight: "500", cursor: "pointer"
                }}>
                Submit Solution
              </button>
            </div>
          </section>

          {/* Chat / Console */}
          <section style={{
            flex: 1, display: "flex", flexDirection: "column",
            background: "#09090B", overflow: "hidden", minHeight: 0
          }}>

            {/* Tabs */}
            <div style={{
              height: "38px", borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "#0A0A0C", display: "flex", padding: "0 16px", flexShrink: 0
            }}>
              {["chat", "console"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{
                    background: "transparent", border: "none",
                    borderBottom: activeTab === tab ? "2px solid #fff" : "2px solid transparent",
                    color: activeTab === tab ? "#fff" : "#88888F",
                    padding: "0 16px", fontSize: "13px", fontWeight: "500", cursor: "pointer"
                  }}>
                  {tab === "chat" ? "Lobby Chat" : "Console Logs"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
              {activeTab === "chat" ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
                  {/* Messages */}
                  <div style={{
                    flex: 1, overflowY: "auto", padding: "16px",
                    display: "flex", flexDirection: "column", gap: "12px", minHeight: 0
                  }}>
                    {messages.length === 0 ? (
                      <div style={{
                        height: "100%", display: "flex", alignItems: "center",
                        justifyContent: "center", color: "#3F3F46", fontSize: "13px"
                      }}>
                        Say hi to your partner!
                      </div>
                    ) : messages.map((msg, i) => {
                      const isMe = msg.userId === user?._id;
                      const isAI = msg.userId === "gemini-ai";
                      if (isAI) {
                        return (
                          <div key={i} style={{
                            display: "flex", flexDirection: "column",
                            alignSelf: "center", width: "90%", margin: "8px 0"
                          }}>
                            <div style={{
                              display: "flex", alignItems: "center", gap: "6px",
                              fontSize: "11px", fontWeight: "600", color: "#A78BFA",
                              marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em"
                            }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#A78BFA" }}>
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                                <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5 5 3Z" fill="currentColor" stroke="none" style={{ opacity: 0.7 }} />
                                <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" fill="currentColor" stroke="none" style={{ opacity: 0.7 }} />
                              </svg>
                              Gemini Code Mentor ✨
                              <span style={{ fontSize: "9px", color: "#71717A", textTransform: "none", fontWeight: "normal", marginLeft: "auto" }}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <div style={{
                              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(76, 29, 149, 0.05) 100%)",
                              border: "1px solid rgba(139, 92, 246, 0.3)",
                              boxShadow: "0 0 15px rgba(139, 92, 246, 0.15)",
                              borderRadius: "10px",
                              padding: "12px 16px",
                              fontSize: "13px",
                              lineHeight: "1.5",
                              color: "#E4E4E7",
                              wordBreak: "break-word",
                              position: "relative"
                            }}>
                              {msg.text}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={i} style={{
                          display: "flex", flexDirection: "column",
                          alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "70%"
                        }}>
                          <div style={{
                            fontSize: "10px", color: "#88888F", marginBottom: "4px",
                            textAlign: isMe ? "right" : "left"
                          }}>
                            {isMe ? "You" : msg.userName || "Peer"} •{" "}
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div style={{
                            background: isMe ? "#fff" : "#18181B",
                            color: isMe ? "#000" : "#fff", borderRadius: "8px",
                            padding: "8px 12px", fontSize: "13px", lineHeight: "1.4",
                            wordBreak: "break-word"
                          }}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>
                  {/* Input */}
                  <form onSubmit={handleSendMessage} style={{
                    padding: "12px 16px",
                    borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0A0A0C",
                    display: "flex", gap: "10px", flexShrink: 0
                  }}>
                    <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                      placeholder="Type a message…"
                      style={{
                        flex: 1, background: "#050506", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "6px", padding: "8px 12px", color: "#fff",
                        fontSize: "13px", outline: "none"
                      }} />
                    <button type="submit" style={{
                      background: "#fff", color: "#000",
                      border: "none", borderRadius: "6px", padding: "8px 16px",
                      fontSize: "13px", fontWeight: "500", cursor: "pointer"
                    }}>
                      Send
                    </button>
                  </form>
                </div>
              ) : (
                /* Console */
                <div style={{
                  flex: 1, overflowY: "auto", background: "#050506",
                  color: "#A1A1AA", fontFamily: "var(--font-geist-mono),monospace",
                  fontSize: "13px", display: "flex", flexDirection: "column", minHeight: 0
                }}>
                  {isRunning ? (
                    <div style={{
                      flex: 1, display: "flex", alignItems: "center",
                      justifyContent: "center", flexDirection: "column", gap: "12px", padding: "40px"
                    }}>
                      <svg style={{ animation: "cm-spin 1s linear infinite", width: 20, height: 20 }}
                        viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      <p style={{ fontSize: "12px", color: "#88888F" }}>{consoleOutput}</p>
                    </div>
                  ) : executionReport ? (
                    <div style={{
                      flex: 1, padding: "20px", display: "flex",
                      flexDirection: "column", gap: "16px", minHeight: 0
                    }}>
                      <div style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)",
                        paddingBottom: "12px"
                      }}>
                        <span style={{
                          fontSize: "16px", fontWeight: "700",
                          color: executionReport.success ? "#10B981" : "#EF4444"
                        }}>
                          {executionReport.status || (executionReport.success ? "Accepted 🎉" : "Wrong Answer ❌")}
                        </span>
                        <span style={{ fontSize: "12px", color: "#88888F" }}>
                          Time: <strong style={{ color: "#fff" }}>{executionReport.execution_time || "0 ms"}</strong>
                        </span>
                      </div>
                      {executionReport.compile_output && (
                        <div>
                          <div style={{ fontSize: "11px", color: "#EF4444", marginBottom: "6px" }}>Compilation Error</div>
                          <pre style={{
                            background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)",
                            borderRadius: "8px", padding: "16px", margin: 0, color: "#F87171",
                            overflowX: "auto", whiteSpace: "pre-wrap"
                          }}>
                            {executionReport.compile_output}
                          </pre>
                        </div>
                      )}
                      {executionReport.stderr && (
                        <div>
                          <div style={{ fontSize: "11px", color: "#EF4444", marginBottom: "6px" }}>Runtime Error</div>
                          <pre style={{
                            background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)",
                            borderRadius: "8px", padding: "16px", margin: 0, color: "#F87171",
                            overflowX: "auto", whiteSpace: "pre-wrap"
                          }}>
                            {executionReport.stderr}
                          </pre>
                        </div>
                      )}
                      {executionReport.stdout && (
                        <div>
                          <div style={{ fontSize: "11px", color: "#88888F", marginBottom: "6px" }}>Standard Output</div>
                          <pre style={{
                            background: "#0C0C0E", border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "8px", padding: "16px", margin: 0, color: "#E4E4E7",
                            overflowX: "auto", whiteSpace: "pre-wrap"
                          }}>
                            {executionReport.stdout}
                          </pre>
                        </div>
                      )}
                      {!executionReport.stdout && !executionReport.stderr && !executionReport.compile_output && (
                        <div style={{ fontSize: "12px", color: "#88888F", fontStyle: "italic" }}>
                          Execution completed with no output.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ flex: 1, padding: "20px", whiteSpace: "pre-wrap", color: "#88888F" }}>
                      {consoleOutput}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Video Call Panel */}
        {!isSolo && callState === "connected" && user && peerUser && (
          <VideoCallPanel
            sessionId={sessionId}
            user={user}
            peerUser={peerUser}
            socketRef={socketRef}
            onClose={endCall}
          />
        )}
      </div>

      {/* Incoming Call Modal */}
      {!isSolo && callState === "incoming" && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 50
        }}>
          <div style={{
            background: "#0C0C0E", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px", padding: "32px", width: "340px", textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
          }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", color: "#8B5CF6"
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#fff", marginBottom: "8px" }}>
              Incoming Call
            </h3>
            <p style={{ fontSize: "14px", color: "#A1A1AA", marginBottom: "24px" }}>
              {peerUser?.name || "Partner"} is calling you
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={rejectCall} style={{
                flex: 1, padding: "10px",
                background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px", color: "#EF4444", fontSize: "14px", fontWeight: "500", cursor: "pointer"
              }}>
                Reject
              </button>
              <button onClick={acceptCall} style={{
                flex: 1, padding: "10px",
                background: "#10B981", border: "none",
                borderRadius: "8px", color: "#000", fontSize: "14px", fontWeight: "600", cursor: "pointer"
              }}>
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
