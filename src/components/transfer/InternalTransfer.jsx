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

  const selectedCoin = getCoin(coin);
  const numericAmount = parseFloat(amount) || 0;

  const isValid = useMemo(() => {
    return (
      recipient.trim().length >= 3 &&
      numericAmount > 0 &&
      numericAmount <= selectedCoin.balance
    );
  }, [recipient, numericAmount, selectedCoin]);

  const handleContinue = () => {
    if (!isValid) return;
    updateDraft({
      type: "internal",
      recipient: recipient.trim(),
      coin,
      amount,
      note: note.trim(),
    });
    navigate("/transfer/review");
  };

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <TransferHeader title="Internal Transfer" />

      <div className="flex flex-1 flex-col gap-5 px-4 pb-8 pt-6 sm:px-6">
        <div>
          <FieldLabel>Recipient UID or Username</FieldLabel>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="e.g. UID123456 or @username"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[14.5px] text-white placeholder-white/30 outline-none transition focus:border-[#7C3AED]/60"
          />
        </div>

        <div>
          <FieldLabel>Coin</FieldLabel>
          <CoinSelector value={coin} onChange={setCoin} />
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

        <div>
          <FieldLabel>Note (optional)</FieldLabel>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a message for the recipient"
            rows={3}
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[14px] text-white placeholder-white/30 outline-none transition focus:border-[#7C3AED]/60"
          />
        </div>

        <GlowCard className="!bg-transparent !border-white/5 !shadow-none">
          <p className="text-[12px] leading-relaxed text-white/40">
            Internal transfers are instant and free. No wallet address or blockchain network is required.
          </p>
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
