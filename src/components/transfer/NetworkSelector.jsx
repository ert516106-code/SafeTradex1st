import React from "react";
import { useNavigate } from "react-router-dom";
import { TransferHeader, NETWORKS, useTransfer } from "../../pages/Transfer";

export default function NetworkSelector() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useTransfer();

  const handleSelect = (id) => {
    updateDraft({ networkId: id });
    navigate(-1);
  };

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <TransferHeader title="Select Network" />

      <div className="flex flex-col gap-3 px-4 pb-10 pt-6 sm:px-6">
        {NETWORKS.map((n) => {
          const isSelected = draft.networkId === n.id;
          return (
            <button
              key={n.id}
              onClick={() => handleSelect(n.id)}
              className={`rounded-2xl border p-4 text-left transition active:scale-[0.98] ${
                isSelected
                  ? "border-[#7C3AED]/60 bg-[#7C3AED]/10 shadow-[0_0_24px_-8px_rgba(124,58,237,0.5)]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-[14.5px] font-bold text-white">{n.label}</span>
                  <span className="text-[11.5px] text-white/40">({n.chain})</span>
                </span>
                {isSelected && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7C3AED]">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Stat label="Fee" value={`${n.fee} ${n.feeUnit}`} />
                <Stat label="Min. Withdrawal" value={`${n.min} ${n.feeUnit}`} />
                <Stat label="Est. Arrival" value={n.eta} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-black/20 px-2.5 py-2">
      <p className="text-[10px] text-white/35">{label}</p>
      <p className="mt-0.5 text-[12px] font-semibold text-white/85">{value}</p>
    </div>
  );
}
