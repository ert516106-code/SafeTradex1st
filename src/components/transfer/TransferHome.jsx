import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TransferHeader } from "../../pages/Transfer";

function OptionCard({ title, description, tag, tagColor, icon, iconBg, onClick, delay }) {
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 16,
        textAlign: "left",
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(155deg, rgba(124,58,237,0.10), rgba(11,15,36,0.9) 60%)",
        boxShadow: "0 20px 45px -18px rgba(124,58,237,0.45)",
        padding: 20,
        cursor: "pointer",
        opacity: mounted ? 1 : 0,
        transform: `translateY(${mounted ? 0 : 14}px) scale(${pressed ? 0.98 : 1})`,
        transition: "opacity 0.5s ease, transform 0.3s ease",
      }}
    >
      <span
        style={{
          width: 56,
          height: 56,
          minWidth: 56,
          borderRadius: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: iconBg,
          boxShadow: "0 0 24px rgba(124,58,237,0.3)",
        }}
      >
        {icon}
      </span>

      <span style={{ flex: 1 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 16.5, fontWeight: 800, color: "#fff" }}>{title}</span>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: tagColor,
              background: `${tagColor}1F`,
              borderRadius: 999,
              padding: "2px 8px",
            }}
          >
            {tag}
          </span>
        </span>
        <span style={{ display: "block", fontSize: 13, lineHeight: 1.45, color: "rgba(255,255,255,0.5)" }}>
          {description}
        </span>
      </span>

      <span
        style={{
          width: 30,
          height: 30,
          minWidth: 30,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}

export default function TransferHome() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <TransferHeader title="Transfer" onClose={() => navigate(-1)} />

      <div style={{ padding: "26px 18px 8px" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fff" }}>Where to?</h2>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          Choose how you'd like to move your assets.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "18px 18px 40px" }}>
        <OptionCard
          title="Internal Transfer"
          description="Send crypto instantly to another SafeTrade user."
          tag="Instant · Free"
          tagColor="#A78BFA"
          iconBg="linear-gradient(135deg, rgba(124,58,237,0.3), rgba(124,58,237,0.08))"
          delay={80}
          onClick={() => navigate("/transfer/internal")}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 7h10m0 0l-3-3m3 3l-3 3M17 17H7m0 0l3 3m-3-3l3-3"
                stroke="#C4B5FD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />

        <OptionCard
          title="External Transfer"
          description="Send crypto to another exchange or blockchain wallet."
          tag="Network fee"
          tagColor="#60A5FA"
          iconBg="linear-gradient(135deg, rgba(37,99,235,0.3), rgba(37,99,235,0.08))"
          delay={180}
          onClick={() => navigate("/transfer/external")}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8.5" stroke="#93C5FD" strokeWidth="2" />
              <path
                d="M3.5 12h17M12 3.5c2.2 2.3 3.4 5.2 3.4 8.5s-1.2 6.2-3.4 8.5c-2.2-2.3-3.4-5.2-3.4-8.5S9.8 5.8 12 3.5z"
                stroke="#93C5FD"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}
