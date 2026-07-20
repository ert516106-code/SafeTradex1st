import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WithdrawHeader, NETWORKS, useWithdraw } from "../../pages/Withdraw";

const NETWORK_ICON_BG = {
  trc20: "linear-gradient(135deg, #DC2626, #7F1D1D)",
  erc20: "linear-gradient(135deg, #627EEA, #2D3F8F)",
  bep20: "linear-gradient(135deg, #F3BA2F, #92700C)",
  polygon: "linear-gradient(135deg, #8247E5, #4C1D95)",
  solana: "linear-gradient(135deg, #9945FF, #14F195)",
};

function NetworkIcon({ id }) {
  return (
    <span
      style={{
        width: 42,
        height: 42,
        minWidth: 42,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 800,
        color: "#fff",
        background: NETWORK_ICON_BG[id] || "linear-gradient(135deg, #7C3AED, #2563EB)",
        boxShadow: "0 0 18px rgba(0,0,0,0.35)",
      }}
    >
      {id.slice(0, 2).toUpperCase()}
    </span>
  );
}

function NetworkCard({ n, isSelected, isRecommended, onSelect, delay }) {
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <button
      onClick={onSelect}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        width: "100%",
        textAlign: "left",
        borderRadius: 20,
        border: isSelected ? "1px solid rgba(167,139,250,0.55)" : "1px solid rgba(255,255,255,0.08)",
        background: isSelected
          ? "linear-gradient(155deg, rgba(124,58,237,0.16), rgba(11,15,36,0.9) 65%)"
          : "linear-gradient(155deg, rgba(255,255,255,0.03), rgba(11,15,36,0.85) 65%)",
        boxShadow: isSelected ? "0 20px 45px -18px rgba(124,58,237,0.55)" : "none",
        padding: 16,
        cursor: "pointer",
        opacity: mounted ? 1 : 0,
        transform: `translateY(${mounted ? 0 : 12}px) scale(${pressed ? 0.98 : 1})`,
        transition: "opacity 0.45s ease, transform 0.25s ease, border-color 0.2s ease, background 0.2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <NetworkIcon id={n.id} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15.5, fontWeight: 800, color: "#fff" }}>{n.label}</span>
            {isRecommended && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#6EE7B7",
                  background: "rgba(16,185,129,0.15)",
                  borderRadius: 999,
                  padding: "2px 8px",
                }}
              >
                Recommended
              </span>
            )}
          </div>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{n.chain}</span>
        </div>

        <span
          style={{
            width: 24,
            height: 24,
            minWidth: 24,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: isSelected ? "none" : "1.5px solid rgba(255,255,255,0.2)",
            background: isSelected ? "#7C3AED" : "transparent",
          }}
        >
          {isSelected && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <Stat label="Fee" value={`${n.fee} ${n.feeUnit}`} />
        <Stat label="Min." value={`${n.min} ${n.feeUnit}`} />
        <Stat label="Arrival" value={n.eta} />
      </div>
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        borderRadius: 12,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "8px 10px",
      }}
    >
      <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{label}</p>
      <p style={{ margin: "3px 0 0", fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{value}</p>
    </div>
  );
}

export default function NetworkSelector() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useWithdraw();

  const cheapestId = NETWORKS.reduce((best, n) => (n.fee < best.fee ? n : best), NETWORKS[0]).id;

  const handleSelect = (id) => {
    updateDraft({ networkId: id });
    navigate(-1);
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <WithdrawHeader title="Select Network" />

      <div style={{ padding: "22px 18px 8px" }}>
        <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
          Choose the network you'll withdraw on. Fees and arrival times vary by chain.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 18px 40px" }}>
        {NETWORKS.map((n, i) => (
          <NetworkCard
            key={n.id}
            n={n}
            isSelected={draft.networkId === n.id}
            isRecommended={n.id === cheapestId}
            onSelect={() => handleSelect(n.id)}
            delay={i * 70}
          />
        ))}
      </div>
    </div>
  );
}
