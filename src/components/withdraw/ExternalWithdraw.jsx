import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  WithdrawHeader,
  GlowCard,
  PrimaryButton,
  FieldLabel,
  CoinSelector,
  useWithdraw,
  getCoin,
  getNetwork,
} from "../../pages/Withdraw";

export default function ExternalWithdraw() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useWithdraw();

  const [coin, setCoin] = useState(draft.coin);
  const [walletAddress, setWalletAddress] = useState(draft.walletAddress || "");
  const [amount, setAmount] = useState(draft.amount || "");
  const [focusField, setFocusField] = useState(null);

  const selectedCoin = getCoin(coin);
  const network = getNetwork(draft.networkId);
  const numericAmount = parseFloat(amount) || 0;

  const receives = useMemo(() => {
    if (!network) return 0;
    const value = numericAmount - network.fee;
    return value > 0 ? value : 0;
  }, [numericAmount, network]);

  const isValid = useMemo(() => {
    return (
      !!network &&
      walletAddress.trim().length >= 10 &&
      numericAmount >= (network?.min || 0) &&
      numericAmount <= selectedCoin.balance
    );
  }, [network, walletAddress, numericAmount, selectedCoin]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setWalletAddress(text.trim());
    } catch {
      // Clipboard access denied or unavailable — ignore silently.
    }
  };

  const handleContinue = () => {
    if (!isValid) return;
    updateDraft({ type: "external", coin, walletAddress: walletAddress.trim(), amount });
    navigate("/withdraw/review");
  };

  const fieldBorder = (field) =>
    `1px solid ${focusField === field ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.1)"}`;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <WithdrawHeader title="External Withdraw" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18, padding: "22px 18px 32px" }}>
        <GlowCard style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <FieldLabel>Coin</FieldLabel>
            <CoinSelector value={coin} onChange={setCoin} />
          </div>

          <div>
            <FieldLabel>Network</FieldLabel>
            <button
              type="button"
              onClick={() => navigate("/withdraw/external/network")}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 16,
                border: network ? "1px solid rgba(124,58,237,0.35)" : "1px solid rgba(255,255,255,0.1)",
                background: network ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.04)",
                padding: "14px 16px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {network ? (
                <span>
                  <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, color: "#fff" }}>
                    {network.label}
                  </span>
                  <span style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                    {network.chain}
                  </span>
                </span>
              ) : (
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Select Network</span>
              )}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "rgba(255,255,255,0.4)" }}>
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div>
            <FieldLabel>Wallet Address</FieldLabel>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderRadius: 16,
                border: fieldBorder("wallet"),
                background: "rgba(255,255,255,0.04)",
                padding: "13px 14px",
                transition: "border-color 0.2s ease",
              }}
            >
              <input
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                onFocus={() => setFocusField("wallet")}
                onBlur={() => setFocusField(null)}
                placeholder="Enter or paste wallet address"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: 13.5,
                }}
              />
              <button
                type="button"
                onClick={handlePaste}
                style={{
                  flexShrink: 0,
                  border: "none",
                  borderRadius: 999,
                  background: "rgba(124,58,237,0.18)",
                  color: "#C4B5FD",
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Paste
              </button>
            </div>
          </div>

          <div>
            <FieldLabel
              right={
                <button
                  type="button"
                  onClick={() => setAmount(String(selectedCoin.balance))}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#A78BFA",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Max
                </button>
              }
            >
              Amount
            </FieldLabel>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderRadius: 16,
                border: fieldBorder("amount"),
                background: "rgba(255,255,255,0.04)",
                padding: "14px 16px",
                transition: "border-color 0.2s ease",
              }}
            >
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onFocus={() => setFocusField("amount")}
                onBlur={() => setFocusField(null)}
                placeholder="0.00"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: 19,
                  fontWeight: 700,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#A78BFA",
                  background: "rgba(124,58,237,0.15)",
                  borderRadius: 999,
                  padding: "5px 10px",
                  whiteSpace: "nowrap",
                }}
              >
                {coin}
              </span>
            </div>
            <p style={{ margin: "8px 2px 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              Available: <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{selectedCoin.balance} {coin}</span>
            </p>
          </div>
        </GlowCard>

        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(124,58,237,0.18)",
            background: "linear-gradient(180deg, rgba(37,99,235,0.06), rgba(11,15,36,0.85))",
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Row label="Blockchain Fee" value={network ? `${network.fee} ${network.feeUnit}` : "—"} />
          <Row label="Minimum Withdrawal" value={network ? `${network.min} ${network.feeUnit}` : "—"} />
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
          <Row
            label="Recipient Receives"
            value={network ? `${receives.toFixed(4)} ${coin}` : "—"}
            highlight
          />
        </div>

        <div style={{ marginTop: "auto", paddingTop: 4 }}>
          <PrimaryButton onClick={handleContinue} disabled={!isValid}>
            Continue
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>{label}</span>
      <span
        style={{
          fontSize: highlight ? 14.5 : 13,
          fontWeight: highlight ? 800 : 600,
          color: highlight ? "#A78BFA" : "rgba(255,255,255,0.85)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
