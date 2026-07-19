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
  getNetwork,
} from "../../pages/Transfer";

export default function ExternalTransfer() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useTransfer();

  const [coin, setCoin] = useState(draft.coin);
  const [walletAddress, setWalletAddress] = useState(draft.walletAddress || "");
  const [amount, setAmount] = useState(draft.amount || "");

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
    updateDraft({
      type: "external",
      coin,
      walletAddress: walletAddress.trim(),
      amount,
    });
    navigate("/transfer/review");
  };

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <TransferHeader title="External Transfer" />

      <div className="flex flex-1 flex-col gap-5 px-4 pb-8 pt-6 sm:px-6">
        <div>
          <FieldLabel>Coin</FieldLabel>
          <CoinSelector value={coin} onChange={setCoin} />
        </div>

        <div>
          <FieldLabel>Network</FieldLabel>
          <button
            type="button"
            onClick={() => navigate("/transfer/external/network")}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-left transition active:scale-[0.99]"
          >
            {network ? (
              <span>
                <span className="block text-[14.5px] font-semibold text-white">{network.label}</span>
                <span className="block text-[12px] text-white/40">{network.chain}</span>
              </span>
            ) : (
              <span className="text-[14px] text-white/40">Select Network</span>
            )}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white/40">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div>
          <FieldLabel>Wallet Address</FieldLabel>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
            <input
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter or paste wallet address"
              className="w-full bg-transparent text-[13.5px] text-white outline-none placeholder-white/30"
            />
            <button
              type="button"
              onClick={handlePaste}
              className="shrink-0 rounded-lg bg-[#7C3AED]/15 px-3 py-1.5 text-[11.5px] font-semibold text-[#A78BFA] transition active:scale-95"
            >
              Paste
            </button>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <FieldLabel>Amount</FieldLabel>
            <button
              type="button"
              onClick={() => setAmount(String(selectedCoin.balance))}
              className="mb-2 text-[12px] font-semibold text-[#A78BFA]"
            >
              Max
            </button>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-[16px] font-semibold text-white outline-none placeholder-white/30"
            />
            <span className="text-[13px] font-bold text-white/40">{coin}</span>
          </div>
          <p className="mt-2 text-[12px] text-white/40">
            Available Balance: <span className="text-white/70">{selectedCoin.balance} {coin}</span>
          </p>
        </div>

        <GlowCard className="flex flex-col gap-2.5 !p-4">
          <Row label="Blockchain Fee" value={network ? `${network.fee} ${network.feeUnit}` : "—"} />
          <Row label="Minimum Withdrawal" value={network ? `${network.min} ${network.feeUnit}` : "—"} />
          <Row
            label="Recipient Receives"
            value={network ? `${receives.toFixed(4)} ${coin}` : "—"}
            highlight
          />
        </GlowCard>

        <div className="mt-auto pt-2">
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
    <div className="flex items-center justify-between">
      <span className="text-[12.5px] text-white/45">{label}</span>
      <span className={`text-[13px] font-semibold ${highlight ? "text-[#A78BFA]" : "text-white/80"}`}>
        {value}
      </span>
    </div>
  );
}
