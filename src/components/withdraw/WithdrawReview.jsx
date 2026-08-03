import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WithdrawHeader, GlowCard, PrimaryButton, useWithdraw, getCoin, getNetwork } from "../../pages/Withdraw";
import { supabase } from "../../lib/supabase";

export default function WithdrawReview() {
  const navigate = useNavigate();
  const { draft, resetDraft } = useWithdraw();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const coin = getCoin(draft.coin);
  const network = draft.type === "external" ? getNetwork(draft.networkId) : null;
  const numericAmount = parseFloat(draft.amount) || 0;

  const receives = useMemo(() => {
    if (!network) return numericAmount;
    const value = numericAmount - network.fee;
    return value > 0 ? value : 0;
  }, [numericAmount, network]);

  const handleConfirm = async () => {
    setError("");
    setConfirming(true);
    try {
      if (draft.type === "internal") {
        const { error: rpcError } = await supabase.rpc("submit_internal_withdrawal", {
          p_recipient_input: draft.recipient,
          p_coin: draft.coin,
          p_amount: numericAmount,
          p_note: draft.note || null,
        });
        if (rpcError) throw rpcError;
      } else if (draft.type === "external") {
        const { error: rpcError } = await supabase.rpc("submit_external_withdrawal", {
          p_coin: draft.coin,
          p_amount: numericAmount,
          p_network: network ? network.id : draft.networkId,
          p_wallet_address: draft.walletAddress,
          p_fee: network ? network.fee : 0,
        });
        if (rpcError) throw rpcError;
      } else {
        throw new Error("Unknown withdrawal type");
      }

      resetDraft();
      navigate("/withdraw/success");
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
      setConfirming(false);
    }
  };

  if (!draft.type) {
    return (
      <div className="mx-auto flex min-h-full max-w-lg flex-col">
        <WithdrawHeader title="Review Withdraw" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-[14px] text-white/50">No withdraw details found.</p>
          <button
            onClick={() => navigate("/withdraw")}
            className="text-[13px] font-semibold text-[#A78BFA]"
          >
            Start a new withdraw
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <WithdrawHeader title="Review Withdraw" />

      <div className="flex flex-1 flex-col gap-5 px-4 pb-8 pt-6 sm:px-6">
        <div className="flex flex-col items-center gap-2 py-2">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full text-[13px] font-bold text-white"
            style={{ background: coin.color }}
          >
            {coin.symbol.slice(0, 1)}
          </span>
          <p className="text-[26px] font-extrabold text-white">
            {draft.amount} <span className="text-white/40">{coin.symbol}</span>
          </p>
          <span className="rounded-full bg-white/5 px-3 py-1 text-[11.5px] font-semibold text-white/50">
            {draft.type === "internal" ? "Internal Withdraw" : "External Withdraw"}
          </span>
        </div>

        <GlowCard className="flex flex-col gap-3 !p-4">
          {draft.type === "internal" ? (
            <>
              <Row label="Recipient" value={draft.recipient} />
              <Row label="Coin" value={coin.symbol} />
              <Row label="Amount" value={`${draft.amount} ${coin.symbol}`} />
              {draft.note && <Row label="Note" value={draft.note} />}
            </>
          ) : (
            <>
              <Row label="Coin" value={coin.symbol} />
              <Row label="Network" value={network ? `${network.label} (${network.chain})` : "—"} />
              <Row label="Wallet Address" value={draft.walletAddress} truncate />
              <Row label="Amount" value={`${draft.amount} ${coin.symbol}`} />
              <Row label="Fee" value={network ? `${network.fee} ${network.feeUnit}` : "—"} />
              <Row label="Recipient Receives" value={`${receives.toFixed(4)} ${coin.symbol}`} highlight />
            </>
          )}
        </GlowCard>

        {draft.type === "internal" && (
          <p className="px-1 text-center text-[12px] leading-relaxed text-white/40">
            This request goes to admin review before funds are sent. You'll see its status
            under Withdraw History.
          </p>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[13px] font-medium text-red-300">
            {error}
          </div>
        )}

        <div className="mt-auto pt-2">
          <PrimaryButton onClick={handleConfirm} disabled={confirming}>
            {confirming ? "Submitting..." : "Confirm Withdraw"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight = false, truncate = false }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="shrink-0 text-[12.5px] text-white/45">{label}</span>
      <span
        className={`text-right text-[13px] font-semibold ${highlight ? "text-[#A78BFA]" : "text-white/85"} ${
          truncate ? "max-w-[180px] truncate" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
