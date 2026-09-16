"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * VideoCallPanel — Stable PeerJS-based A/V calling panel.
 *
 * Architecture:
 *  - Media streams live in refs ONLY (no state) → no re-render cascades.
 *  - Video elements are always in the DOM; CSS hides them → no play() abort.
 *  - Single initializedRef guard prevents React StrictMode double-invocation.
 *  - PeerJS effect depends ONLY on sessionId (stable string).
 *  - All mutable values read from refs at call-time.
 */
export default function VideoCallPanel({ sessionId, user, peerUser, socketRef, onClose }) {
  // ── UI-only state (booleans are cheap, won't cascade) ─────────────────────
  const [micOn, setMicOn]           = useState(true);
  const [camOn, setCamOn]           = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [hasLocal, setHasLocal]     = useState(false);
  const [hasRemote, setHasRemote]   = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // ── Stable refs — never cause re-renders ──────────────────────────────────
  const localVideoRef   = useRef(null);
  const remoteVideoRef  = useRef(null);
  const localStreamRef  = useRef(null);
  const peerRef         = useRef(null);
  const callRef         = useRef(null);
  const initializedRef  = useRef(false);

  // Derived PeerJS IDs — computed once per stable sessionId/userIds
  const myPeerId    = user    && sessionId ? `cm-${sessionId}-${user._id}`       : null;
  const theirPeerId = peerUser && sessionId ? `cm-${sessionId}-${peerUser._id}` : null;

  // ── Attach stream to a video element imperatively ─────────────────────────
  const attachStream = useCallback((videoEl, stream) => {
    if (!videoEl || !stream) return;
    if (videoEl.srcObject === stream) return; // already set — skip
    videoEl.srcObject = stream;
    videoEl.play().catch(() => {}); // autoplay policy — ignore non-fatal errors
  }, []);

  // ── Handle incoming remote stream ─────────────────────────────────────────
  const handleRemoteStream = useCallback((stream) => {
    attachStream(remoteVideoRef.current, stream);
    setHasRemote(true);
    setIsConnected(true);
  }, [attachStream]);

  // ── Main PeerJS setup effect ───────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId || !user || !peerUser || !myPeerId || !theirPeerId) return;
    if (initializedRef.current) return; // StrictMode guard
    initializedRef.current = true;

    let peer   = null;
    let stream = null;
    let destroyed = false;

    const setup = async () => {
      try {
        // 1. Acquire media — stop any stale tracks first
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(t => t.stop());
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, frameRate: 15 },
          audio: true,
        });
        if (destroyed) { stream.getTracks().forEach(t => t.stop()); return; }

        localStreamRef.current = stream;
        attachStream(localVideoRef.current, stream);
        setHasLocal(true);

        // 2. Create PeerJS instance with deterministic ID
        const { Peer } = await import("peerjs");
        if (destroyed) return;

        peer = new Peer(myPeerId, {
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
            ],
          },
        });
        peerRef.current = peer;

        // 3. Caller side — lexicographically smaller userId initiates
        peer.on("open", () => {
          if (destroyed || peer.destroyed) return;
          if (user._id < peerUser._id) {
            setTimeout(() => {
              if (destroyed || peer.destroyed) return;
              const call = peer.call(theirPeerId, localStreamRef.current);
              callRef.current = call;
              call.on("stream", handleRemoteStream);
              call.on("close", () => { setHasRemote(false); setIsConnected(false); });
              call.on("error", (e) => console.warn("PeerJS call error:", e));
            }, 1800); // give receiver time to register
          }
        });

        // 4. Receiver side — answer incoming call
        peer.on("call", (call) => {
          if (callRef.current) callRef.current.close(); // avoid duplicate calls
          callRef.current = call;
          call.answer(localStreamRef.current);
          call.on("stream", handleRemoteStream);
          call.on("close", () => { setHasRemote(false); setIsConnected(false); });
          call.on("error", (e) => console.warn("PeerJS call error:", e));
        });

        peer.on("error", (err) => {
          // "unavailable-id" fires when user refreshes — PeerJS retries internally
          if (err.type !== "unavailable-id") {
            console.warn("PeerJS error:", err.type, err.message);
          }
        });

        peer.on("disconnected", () => {
          if (!destroyed && !peer.destroyed) peer.reconnect();
        });

      } catch (err) {
        if (err.name === "NotReadableError") {
          console.warn("Camera/mic in use. Retrying in 2s…");
          setTimeout(setup, 2000);
        } else {
          console.error("Media access error:", err.name, err.message);
          setMediaError(err.name === "NotAllowedError" ? "Permission Denied" : err.message || "Failed to access camera/mic");
        }
      }
    };

    setup();

    return () => {
      destroyed = true;
      initializedRef.current = false;
      if (callRef.current)  { callRef.current.close();   callRef.current  = null; }
      if (peerRef.current && !peerRef.current.destroyed) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
      setHasLocal(false);
      setHasRemote(false);
      setIsConnected(false);
      setMediaError(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, retryTrigger]); // re-run when sessionId or manual retry trigger changes

  // ── Socket: relay media status & react to peer leaving ────────────────────
  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket) return;

    const onPeerStatus = ({ status }) => {
      if (status !== "online") {
        setHasRemote(false);
        setIsConnected(false);
      }
    };
    socket.on("peer_status", onPeerStatus);
    return () => socket.off("peer_status", onPeerStatus);
  }, [socketRef]);

  // ── Media controls ────────────────────────────────────────────────────────
  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
    socketRef?.current?.emit("media_status", {
      sessionId, mediaType: "audio", enabled: track.enabled,
    });
  };

  const toggleCam = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCamOn(track.enabled);
    socketRef?.current?.emit("media_status", {
      sessionId, mediaType: "video", enabled: track.enabled,
    });
  };

  const endCall = () => {
    if (callRef.current)  { callRef.current.close();   callRef.current  = null; }
    if (peerRef.current && !peerRef.current.destroyed) {
      peerRef.current.destroy(); peerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    initializedRef.current = false;
    setHasLocal(false);
    setHasRemote(false);
    setIsConnected(false);
    onClose?.();
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const S = {
    panel: {
      width: "280px",
      borderLeft: "1px solid rgba(255,255,255,0.08)",
      background: "#050505",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      position: "relative",
    },
    header: {
      padding: "14px 16px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
    },
    headerTitle: {
      fontSize: "11px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "#fff",
    },
    badge: (connected) => ({
      fontSize: "10px",
      padding: "2px 8px",
      borderRadius: "10px",
      background: connected ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.12)",
      color: connected ? "#10B981" : "#F59E0B",
      fontWeight: "600",
      border: `1px solid ${connected ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.2)"}`,
    }),
    videoGrid: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      padding: "14px",
      gap: "12px",
      minHeight: 0,
    },
    videoWrap: {
      flex: 1,
      position: "relative",
      borderRadius: "10px",
      overflow: "hidden",
      background: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.07)",
    },
    video: (visible) => ({
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: visible ? "block" : "none",
    }),
    localVideo: (visible) => ({
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transform: "scaleX(-1)",
      display: visible ? "block" : "none",
    }),
    placeholder: (visible) => ({
      display: visible ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      color: "#444",
      fontSize: "12px",
      flexDirection: "column",
      gap: "8px",
    }),
    label: {
      position: "absolute",
      bottom: "8px",
      left: "8px",
      background: "rgba(0,0,0,0.65)",
      backdropFilter: "blur(4px)",
      padding: "2px 7px",
      borderRadius: "4px",
      fontSize: "10px",
      color: "#fff",
      fontWeight: "500",
    },
    mutedBadge: {
      position: "absolute",
      top: "8px",
      right: "8px",
      background: "#EF4444",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    controls: {
      position: "absolute",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "10px",
      padding: "8px 12px",
      background: "rgba(12,12,14,0.92)",
      backdropFilter: "blur(8px)",
      borderRadius: "24px",
      border: "1px solid rgba(255,255,255,0.1)",
      zIndex: 10,
    },
    btn: (danger, active) => ({
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: danger ? "#EF4444" : active ? "rgba(255,255,255,0.12)" : "#EF4444",
      color: "#fff",
      transition: "transform 0.15s ease, opacity 0.15s ease",
    }),
  };

  const PLACEHOLDER_ICON = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );

  return (
    <section style={S.panel} className="vc-panel">
      <style>{`
        .vc-panel .vc-controls { opacity:0; transform:translateY(8px); transition:all 0.2s ease; }
        .vc-panel:hover .vc-controls { opacity:1; transform:translateY(0); }
        .vc-btn:hover { transform:scale(1.1); }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <span style={S.headerTitle}>Video Call</span>
        <span style={S.badge(isConnected)}>
          {isConnected ? "Connected" : "Connecting…"}
        </span>
      </div>

      {/* Video Grid */}
      <div style={S.videoGrid}>

        {/* Remote video */}
        <div style={S.videoWrap}>
          {/* Video element always in DOM — srcObject set imperatively */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={S.video(hasRemote)}
          />
          <div style={S.placeholder(!hasRemote)}>
            {PLACEHOLDER_ICON}
            <span>{peerUser?.name || "Partner"}</span>
          </div>
          <div style={S.label}>{peerUser?.name || "Partner"}</div>
        </div>

        {/* Local video */}
        <div style={S.videoWrap}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={S.localVideo(hasLocal && camOn)}
          />
          <div style={S.placeholder(!hasLocal || !camOn)}>
            {mediaError ? (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" style={{ marginBottom: "4px" }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span style={{ fontSize: "11px", color: "#F87171", textAlign: "center", padding: "0 10px", lineHeight: "1.4" }}>
                  Camera/mic access blocked.<br />Enable permissions and retry.
                </span>
                <button onClick={() => setRetryTrigger(prev => prev + 1)}
                  style={{
                    marginTop: "8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "4px", color: "#fff", fontSize: "10px", padding: "4px 10px", cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                >
                  Retry Access
                </button>
              </>
            ) : !hasLocal ? (
              <>
                <svg style={{ animation: "cm-spin 1s linear infinite" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <span style={{fontSize:"11px"}}>Accessing camera…</span>
              </>
            ) : (
              <>
                {PLACEHOLDER_ICON}
                <span>Camera Off</span>
              </>
            )}
          </div>
          <div style={S.label}>You</div>
          {!micOn && (
            <div style={S.mutedBadge}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Hover Controls */}
      <div className="vc-controls" style={S.controls}>
        {/* Mic */}
        <button className="vc-btn" onClick={toggleMic} title={micOn ? "Mute" : "Unmute"} style={S.btn(false, micOn)}>
          {micOn ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="23" y2="23"/>
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
              <path d="M17 16.95A7 7 0 0 1 5 12v-2"/>
            </svg>
          )}
        </button>

        {/* Camera */}
        <button className="vc-btn" onClick={toggleCam} title={camOn ? "Camera Off" : "Camera On"} style={S.btn(false, camOn)}>
          {camOn ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 7a2 2 0 0 0-2.45-1.45L16 7V5a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2l4.55 1.45A2 2 0 0 0 23 17V7z"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="23" y2="23"/>
              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/>
              <path d="M10.66 6H14a2 2 0 0 1 2 2v3.34"/>
            </svg>
          )}
        </button>

        {/* End Call */}
        <button className="vc-btn" onClick={endCall} title="End Call" style={{ ...S.btn(true, false) }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.21 2.2z"/>
          </svg>
        </button>
      </div>
    </section>
  );
}
