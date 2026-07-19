import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TransferHeader, NETWORKS, useTransfer } from "../../pages/Transfer";

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
            {isRecommende
