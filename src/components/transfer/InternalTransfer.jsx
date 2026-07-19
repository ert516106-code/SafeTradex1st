import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TransferHeader,
  GlowCard,
  PrimaryButton,
  FieldLabel,
  CoinSelector,
  useTransfer,
  getCoin,
} from "../../pages/Transfer";

export default function InternalTransfer() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useTransfer();

  const [recipient, setRecipient] = useState(draft.recipient || "");
  const [coin, setCoin] = useState(draft.coin);
  const [amount, setAmount] = useState(draft.amount || "");
  const [note, setNote] = useState(draft.note || "");
  const [focusField, setFocusField] = useState(null);

  const selectedCoin = getCoin(coin);
  const numericAmount = parseFloat(amount) || 0;

  const isValid = useMemo(() => {
    return recipient.trim().length >= 3 && numericAmount > 0 && numericAmount <= selectedCoin.balance;
  }, [recipient, numericAmount, selectedCoin]);

  const handleContinue = () => {
    if (!isValid) return;
    updateDraft({ type: "internal", recipient: recipient.trim(), coin, amount, note: note.trim() });
    navigate("/transfer/review");
  };

  const inputStyle = (field) => ({
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: 14.5,
  });

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <TransferHeader title="Internal Transfer" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18, padding: "22px 18px 32px" }}>
        <GlowCard style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <FieldLabel>Recipient</FieldLabel>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderRadius: 16,
                border: `1px solid ${focusField === "recipient" ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.1)"}`,
                background: "rgba(255,255,255,0.04)",
                padding: "13px 14px",
                transition: "border-color 0.2s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#A78BFA", flexShrink: 0 }}>
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
                <path d="M5 20c1.5-4 4.5-6 7-6s5.5 2 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                onFocus={() => setFocusField("recipient")}
                onBlur={() => setFocusField(null)}
                placeholder="UID123456 or @username"
                style={inputStyle("recipient")}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Coin</FieldLabel>
            <CoinSelector value={coin} onChange={setCoin} />
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
                border: `1px solid ${focusField === "amount" ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.1)"}`,
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
                style={{ ...inputStyle("amount"), fontSize: 19, fontWeight: 700 }}
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

          <div>
            <FieldLabel>Note (optional)</FieldLabel>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onFocus={() => setFocusField("note")}
              onBlur={() => setFocusField(null)}
              placeholder="Add a message for the recipient"
              rows={3}
              style={{
                width: "100%",
                resize: "none",
                borderRadius: 16,
                border: `1px solid ${focusField === "note" ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.1)"}`,
                background: "rgba(255,255,255,0.04)",
                padding: "13px 14px",
                color: "#fff",
                fontSize: 13.5,
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
            />
          </div>
        </GlowCard>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderRadius: 16,
            background: "rgba(124,58,237,0.06)",
            border: "1px solid rgba(124,58,237,0.15)",
            padding: "12px 14px",
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              minWidth: 28,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(124,58,237,0.2)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="#C4B5FD" />
            </svg>
          </span>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "rgba(255,255,255,0.6)" }}>
            Instant and free — no wallet address or blockchain network required.
          </p>
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
