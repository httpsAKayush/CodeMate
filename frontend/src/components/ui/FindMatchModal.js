"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Swords, Mic, MicOff, Clock } from "lucide-react";
import { initSocket, disconnectSocket } from "@/lib/socket";

const DIFFICULTIES = [
  { id: "easy",   label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard",   label: "Hard" },
];

const TOPICS = [
  "Arrays", "Strings", "Linked Lists", "Trees", "Graphs",
  "Dynamic Programming", "Backtracking", "Bit Manipulation",
  "Sliding Window", "Binary Search", "Heap / Priority Queue",
];

export default function FindMatchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState("medium");
  const [topic,      setTopic]      = useState("Arrays");
  const [matchType,  setMatchType]  = useState("random");
  const [voiceChat,  setVoiceChat]  = useState(false);
  const [matching,   setMatching]   = useState(false);
  const [errorMsg,   setErrorMsg]   = useState("");
  const [friendCode, setFriendCode] = useState("");
  const [isJoining,  setIsJoining]  = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const socketRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => { if (e.key === "Escape" && isOpen && !matching) onClose(); },
    [isOpen, onClose, matching]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      // Cleanup socket on unmount if still matching
      if (socketRef.current) {
        socketRef.current.emit("cancel_match");
        disconnectSocket();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleStartMatching = () => {
    setMatching(true);
    setErrorMsg("");
    setGeneratedCode(null);
    
    const socket = initSocket();
    if (!socket) {
      setErrorMsg("Authentication failed. Please log in again.");
      setMatching(false);
      return;
    }
    socketRef.current = socket;

    if (matchType === "friend") {
      if (isJoining) {
        if (friendCode.trim().length !== 6) {
           setErrorMsg("Please enter a valid 6-character code.");
           setMatching(false);
           return;
        }
        socket.emit("join_friend_match", { code: friendCode.trim() });
      } else {
        socket.emit("create_friend_match", { difficulty, topic });
      }
    } else {
      socket.emit("find_match", { difficulty, topic });
    }

    socket.on("friend_match_created", (data) => {
      setGeneratedCode(data.code);
    });

    socket.on("match_found", (data) => {
      console.log("Match found!", data);
      socket.off("match_found");
      socket.off("match_error");
      socket.off("friend_match_created");
      router.push(`/session/${data.sessionId}`);
      onClose(); // close modal
    });

    socket.on("match_error", (data) => {
      console.error("Match error:", data);
      setErrorMsg(data.message || "An error occurred while matching.");
      setMatching(false);
      socket.off("match_found");
      socket.off("match_error");
      socket.off("friend_match_created");
    });
  };

  const handleCancelMatching = () => {
    if (socketRef.current) {
      socketRef.current.emit("cancel_match");
      socketRef.current.off("match_found");
      socketRef.current.off("match_error");
      socketRef.current.off("friend_match_created");
    }
    setMatching(false);
    setGeneratedCode(null);
  };

  return (
    <div
      className="cm-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Find Match Configuration"
    >
      <div className="cm-modal">

        {/* ── Header ─────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid var(--cm-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "var(--cm-radius-sm)",
                background: "var(--cm-surface-3)",
                border: "1px solid var(--cm-border-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Swords size={13} strokeWidth={2} color="var(--cm-text-2)" />
            </div>
            <div>
              <h2
                style={{
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  color: "var(--cm-text-1)",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Find a Match
              </h2>
              <p style={{ fontSize: "0.72rem", color: "var(--cm-text-3)", marginTop: "1px" }}>
                Configure your session preferences
              </p>
            </div>
          </div>

          <CloseButton onClose={onClose} />
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Match Type */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--cm-text-2)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Match Type
            </label>
            <div
              style={{
                display: "flex",
                background: "var(--cm-surface-2)",
                border: "1px solid var(--cm-border)",
                borderRadius: "var(--cm-radius-sm)",
                padding: "3px",
                gap: "3px",
              }}
            >
              {[
                { id: "random", label: "Random Partner" },
                { id: "friend", label: "Friend Invite" },
              ].map(({ id, label }) => {
                const active = matchType === id;
                return (
                  <button
                    key={id}
                    id={`match-type-${id}`}
                    onClick={() => {
                      setMatchType(id);
                      if (id === "random") setIsJoining(false);
                    }}
                    style={{
                      flex: 1,
                      padding: "7px 12px",
                      borderRadius: "4px",
                      background: active ? "var(--cm-surface-4)" : "transparent",
                      border: `1px solid ${active ? "var(--cm-border-3)" : "transparent"}`,
                      color: active ? "var(--cm-text-1)" : "var(--cm-text-3)",
                      fontSize: "0.8rem",
                      fontWeight: active ? 600 : 400,
                      cursor: "pointer",
                      transition: "all var(--cm-t)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {matchType === "friend" && (
            <div style={{ display: "flex", gap: "8px", padding: "4px", background: "var(--cm-surface-2)", borderRadius: "var(--cm-radius-sm)", border: "1px solid var(--cm-border)" }}>
              <button
                onClick={() => setIsJoining(false)}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  borderRadius: "4px",
                  background: !isJoining ? "var(--cm-surface-4)" : "transparent",
                  color: !isJoining ? "var(--cm-text-1)" : "var(--cm-text-3)",
                  border: `1px solid ${!isJoining ? "var(--cm-border-3)" : "transparent"}`,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Create Room
              </button>
              <button
                onClick={() => setIsJoining(true)}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  borderRadius: "4px",
                  background: isJoining ? "var(--cm-surface-4)" : "transparent",
                  color: isJoining ? "var(--cm-text-1)" : "var(--cm-text-3)",
                  border: `1px solid ${isJoining ? "var(--cm-border-3)" : "transparent"}`,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Join Room
              </button>
            </div>
          )}

          {(!isJoining || matchType === "random") ? (
            <>
              {/* Difficulty — monochrome toggle */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "var(--cm-text-2)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Difficulty
                </label>
                <div
                  style={{
                    display: "flex",
                    background: "var(--cm-surface-2)",
                    border: "1px solid var(--cm-border)",
                    borderRadius: "var(--cm-radius-sm)",
                    padding: "3px",
                    gap: "3px",
                  }}
                >
                  {DIFFICULTIES.map(({ id, label }) => {
                    const active = difficulty === id;
                    return (
                      <button
                        key={id}
                        id={`difficulty-${id}`}
                        onClick={() => setDifficulty(id)}
                        style={{
                          flex: 1,
                          padding: "8px 0",
                          borderRadius: "4px",
                          background: active ? "var(--cm-text-1)" : "transparent",
                          border: "none",
                          color: active ? "#080909" : "var(--cm-text-3)",
                          fontSize: "0.8rem",
                          fontWeight: active ? 700 : 500,
                          cursor: "pointer",
                          transition: "all var(--cm-t)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topic */}
              <div>
                <label
                  htmlFor="topic-select"
                  style={{
                    display: "block",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "var(--cm-text-2)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Topic
                </label>
                <select
                  id="topic-select"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="cm-input cm-select"
                >
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "var(--cm-text-2)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Friend Code
              </label>
              <input
                type="text"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength={6}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: "1.2rem",
                  letterSpacing: "0.3em",
                  fontWeight: 600,
                  textAlign: "center",
                  background: "var(--cm-surface-2)",
                  border: "1px solid var(--cm-border)",
                  borderRadius: "var(--cm-radius-sm)",
                  color: "var(--cm-text-1)",
                  outline: "none",
                }}
              />
            </div>
          )}

          {/* Voice Chat toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "13px 16px",
              background: "var(--cm-surface-2)",
              border: "1px solid var(--cm-border)",
              borderRadius: "var(--cm-radius-md)",
              transition: "border-color var(--cm-t)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--cm-border-2)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--cm-border)")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
              {voiceChat
                ? <Mic size={15} strokeWidth={1.8} color="var(--cm-text-2)" />
                : <MicOff size={15} strokeWidth={1.8} color="var(--cm-text-3)" />
              }
              <div>
                <p
                  style={{
                    fontSize: "0.84rem",
                    fontWeight: 600,
                    color: voiceChat ? "var(--cm-text-1)" : "var(--cm-text-2)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Voice Chat
                </p>
                <p style={{ fontSize: "0.7rem", color: "var(--cm-text-3)", marginTop: "1px" }}>
                  {voiceChat ? "Microphone will be requested" : "Text chat only"}
                </p>
              </div>
            </div>

            <label className="cm-toggle" id="voice-chat-toggle">
              <input
                type="checkbox"
                checked={voiceChat}
                onChange={() => setVoiceChat((v) => !v)}
                aria-label="Enable voice chat"
              />
              <div className="cm-toggle-track">
                <div className="cm-toggle-thumb" />
              </div>
            </label>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid var(--cm-border)",
            padding: "14px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {errorMsg && (
            <div style={{ color: "var(--cm-red, #ef4444)", fontSize: "0.75rem", textAlign: "center" }}>
              {errorMsg}
            </div>
          )}
          {generatedCode && (
            <div style={{ textAlign: "center", padding: "10px", background: "var(--cm-surface-2)", border: "1px dashed var(--cm-border-3)", borderRadius: "var(--cm-radius-sm)", marginBottom: "8px" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--cm-text-2)", marginBottom: "4px" }}>Share this code with your friend:</p>
              <p style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.2em", color: "var(--cm-text-1)" }}>{generatedCode}</p>
            </div>
          )}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => {
                if (matching) handleCancelMatching();
                else onClose();
              }}
              className="cm-btn cm-btn-outline"
              style={{ flex: 1, justifyContent: "center", fontSize: "0.84rem" }}
            >
              Cancel
            </button>
            <button
              id="start-matching-btn"
              onClick={matching ? handleCancelMatching : handleStartMatching}
              disabled={matching && (matchType === "random" || generatedCode)}
              className="cm-btn cm-btn-primary"
              style={{
                flex: 2,
                justifyContent: "center",
                padding: "10px 16px",
                fontSize: "0.88rem",
                fontWeight: 700,
                opacity: matching && (matchType === "random" || generatedCode) ? 0.7 : 1,
                cursor: matching && (matchType === "random" || generatedCode) ? "not-allowed" : "pointer"
              }}
            >
              {matching ? (
                <>
                  <svg
                    style={{ animation: "cm-spin 1s linear infinite", width: 14, height: 14 }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  {generatedCode ? "Waiting for friend…" : (isJoining ? "Joining…" : "Searching…")}
                </>
              ) : (
                <>
                  <Swords size={14} strokeWidth={2.2} />
                  {matchType === "friend" ? (isJoining ? "Join Room" : "Generate Code") : "Start Matching"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CloseButton({ onClose }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClose}
      aria-label="Close modal"
      style={{
        width: "28px",
        height: "28px",
        borderRadius: "var(--cm-radius-sm)",
        background: hovered ? "var(--cm-surface-3)" : "transparent",
        border: `1px solid ${hovered ? "var(--cm-border-2)" : "var(--cm-border)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: hovered ? "var(--cm-text-2)" : "var(--cm-text-3)",
        transition: "all var(--cm-t)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <X size={13} strokeWidth={2} />
    </button>
  );
}
