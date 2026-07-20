import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ProfilePageShell({ title, subtitle, children }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top,#1E3170 0%,#091120 70%)",
        color: "#FFFFFF",
        padding: 20,
        paddingBottom: 60,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={18} color="#fff" />
        </button>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{title}</div>
          {subtitle ? (
            <div style={{ color: "#8FA4D8", fontSize: 13, marginTop: 3 }}>{subtitle}</div>
          ) : null}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}
