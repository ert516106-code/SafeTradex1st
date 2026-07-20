import Logo from "../components/ui/Logo";
import ProfilePageShell from "../components/profile/ProfilePageShell";

export default function AboutSafeTrade() {
  return (
    <ProfilePageShell title="About SafeTrade" subtitle="Version 2.0.0">
      <div
        style={{
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.03)",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Logo />
        <div style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", lineHeight: 1.6 }}>
          SafeTrade is a secure crypto exchange platform built for fast, reliable trading.
          Version 2.0.0 — Frontend Demo Build.
        </div>
      </div>
    </ProfilePageShell>
  );
}
