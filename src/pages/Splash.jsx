import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Logo from "../components/ui/Logo";

const LOADING_MESSAGES = [
  "Initializing...",
  "Connecting to Market...",
  "Securing Wallet...",
  "Loading Portfolio...",
  "Welcome...",
];

const PARTICLE_COUNT = 28;
const BAR_DURATION_MS = 4000;
const MESSAGE_INTERVAL_MS = BAR_DURATION_MS / LOADING_MESSAGES.length;
const FADE_OUT_MS = 700;

export default function Splash() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [logoIn, setLogoIn] = useState(false);
  const [textIn, setTextIn] = useState(false);
  const [barIn, setBarIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const hasFinishedRef = useRef(false);
  const sessionResultRef = useRef(null);

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
      const size = 2 + Math.random() * 4;
      const isPurple = i % 2 === 0;
      return {
        id: i,
        size,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 8 + Math.random() * 9,
        delay: Math.random() * 7,
        color: isPurple ? "rgba(167, 139, 250, 0.85)" : "rgba(37, 99, 235, 0.8)",
        drift: Math.random() * 40 - 20,
      };
    });
  }, []);

  // Entrance choreography
  useEffect(() => {
    const t1 = setTimeout(() => setLogoIn(true), 120);
    const t2 = setTimeout(() => setTextIn(true), 520);
    const t3 = setTimeout(() => setBarIn(true), 820);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Kick off the auth check in parallel with the animation, store the result for later
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) sessionResultRef.current = data?.session ?? null;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Rotate loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Progress bar 0 -> 100, then fade out and route based on session
  useEffect(() => {
    const tickMs = 30;
    const step = 100 / (BAR_DURATION_MS / tickMs);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(interval);

          if (!hasFinishedRef.current) {
            hasFinishedRef.current = true;
            setFadeOut(true);

            setTimeout(() => {
              const destination = sessionResultRef.current ? "/home" : "/login";
              navigate(destination, { replace: true });
            }, FADE_OUT_MS);
          }

          return 100;
        }
        return next;
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div style={styles.root}>
      <style>{`
        @keyframes stFloat {
          0% { transform: translate3d(0, 0, 0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate3d(var(--drift, 0px), -120px, 0); opacity: 0; }
        }
        @keyframes stPulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.08); }
        }
        @keyframes stShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes stSpinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        html, body { margin: 0; padding: 0; background: #050816; }
      `}</style>

      {/* Ambient rotating network background footage, kept subtle behind the logo */}
      <div style={styles.videoWrap}>
        <video
          src={new URL("../assets/network-bg.webm", import.meta.url).href}
          autoPlay
          loop
          muted
          playsInline
          style={styles.video}
        />
        <div style={styles.videoTint} />
      </div>

      {/* Glow blobs, purple + dark blue only */}
      <div style={{ ...styles.glowBlob, top: "-12%", left: "-15%", background: "#7C3AED", animationDelay: "0s" }} />
      <div style={{ ...styles.glowBlob, bottom: "-15%", right: "-10%", background: "#2563EB", animationDelay: "1.3s" }} />

      {/* Floating particles */}
      <div style={styles.particleLayer}>
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              animation: `stFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
              "--drift": `${p.drift}px`,
            }}
          />
        ))}
      </div>

      {/* Fade-to-route overlay */}
      <div
        style={{
          ...styles.fadeOverlay,
          opacity: fadeOut ? 1 : 0,
        }}
      />

      {/* Content */}
      <div style={{ ...styles.content, opacity: fadeOut ? 0 : 1 }}>
        <div style={styles.logoRing}>
          <div style={styles.logoRingSpin} />
          <div
            style={{
              transform: `scale(${logoIn ? 1 : 0.4})`,
              opacity: logoIn ? 1 : 0,
              transition: "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease",
              filter:
                "drop-shadow(0 0 24px rgba(124, 58, 237, 0.55)) drop-shadow(0 0 48px rgba(37, 99, 235, 0.35))",
            }}
          >
            <Logo size={120} showText={false} />
          </div>
        </div>

        <div
          style={{
            opacity: textIn ? 1 : 0,
            transform: textIn ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
            textAlign: "center",
          }}
        >
          <h1 style={styles.title}>
            Safe<span style={{ color: "#7C3AED" }}>Trade</span>
          </h1>
          <p style={styles.subtitle}>Secure Crypto Trading Platform</p>
        </div>

        <div
          style={{
            ...styles.barSection,
            opacity: barIn ? 1 : 0,
            transform: barIn ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
          }}
        >
          <div style={styles.barTrack}>
            <div style={{ ...styles.barFill, width: `${progress}%` }} />
            <div style={styles.barShimmer} />
          </div>

          <div style={styles.barFooter}>
            <span style={styles.loadingMessage}>{LOADING_MESSAGES[messageIndex]}</span>
            <span style={styles.progressPct}>{Math.min(100, Math.round(progress))}%</span>
          </div>
        </div>

        <p style={styles.versionLabel}>SafeTrade V2 • Version 2.0</p>
      </div>
    </div>
  );
}

const styles = {
  root: {
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100%",
    minHeight: "100vh",
    background: "#050816",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  videoWrap: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  video: {
    position: "absolute",
    top: "50%",
    left: "50%",
    minWidth: "100%",
    minHeight: "100%",
    width: "auto",
    height: "auto",
    transform: "translate(-50%, -50%)",
    objectFit: "cover",
    opacity: 0.35,
    filter: "saturate(1.6) brightness(0.7) contrast(1.05)",
  },
  videoTint: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at center, rgba(5,8,22,0.35) 0%, rgba(5,8,22,0.85) 65%, #050816 100%)",
  },
  glowBlob: {
    position: "absolute",
    width: "55vmax",
    height: "55vmax",
    borderRadius: "50%",
    filter: "blur(110px)",
    opacity: 0.4,
    animation: "stPulseGlow 6s ease-in-out infinite",
    pointerEvents: "none",
  },
  particleLayer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  fadeOverlay: {
    position: "absolute",
    inset: 0,
    background: "#050816",
    transition: `opacity ${FADE_OUT_MS}ms ease`,
    pointerEvents: "none",
    zIndex: 5,
  },
  content: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "clamp(16px, 4vw, 26px)",
    padding: "24px",
    width: "min(92vw, 420px)",
    transition: "opacity 0.8s ease",
  },
  logoRing: {
    position: "relative",
    width: 152,
    height: 152,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoRingSpin: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "1.5px solid transparent",
    borderTopColor: "rgba(167, 139, 250, 0.55)",
    borderRightColor: "rgba(37, 99, 235, 0.4)",
    animation: "stSpinSlow 3.2s linear infinite",
  },
  title: {
    margin: 0,
    fontSize: "clamp(30px, 8vw, 42px)",
    fontWeight: 800,
    letterSpacing: "-1px",
    color: "#ffffff",
  },
  subtitle: {
    margin: "8px 0 0 0",
    fontSize: "clamp(13px, 3.6vw, 15px)",
    color: "rgba(255, 255, 255, 0.6)",
    letterSpacing: "0.4px",
    fontWeight: 400,
  },
  barSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "4px",
  },
  barTrack: {
    position: "relative",
    width: "100%",
    height: "6px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
  },
  barFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #7C3AED 0%, #A78BFA 50%, #2563EB 100%)",
    boxShadow: "0 0 14px rgba(124, 58, 237, 0.85), 0 0 26px rgba(37, 99, 235, 0.45)",
    transition: "width 0.05s linear",
  },
  barShimmer: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
    backgroundSize: "200% 100%",
    animation: "stShimmer 1.6s linear infinite",
    pointerEvents: "none",
  },
  barFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "12.5px",
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: "0.3px",
  },
  loadingMessage: {
    fontWeight: 500,
  },
  progressPct: {
    fontVariantNumeric: "tabular-nums",
    color: "#A78BFA",
    fontWeight: 600,
  },
  versionLabel: {
    marginTop: "6px",
    fontSize: "11px",
    color: "rgba(255, 255, 255, 0.35)",
    letterSpacing: "0.6px",
  },
};
