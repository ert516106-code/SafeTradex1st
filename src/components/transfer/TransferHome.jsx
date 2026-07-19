import React from "react";
import { useNavigate } from "react-router-dom";
import { TransferHeader } from "../../pages/Transfer";

function OptionCard({ title, description, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b0f24] to-[#0a0e20] p-5 text-left shadow-[0_0_30px_-12px_rgba(124,58,237,0.4)] transition active:scale-[0.98]"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED]/25 to-[#2563EB]/20 shadow-[0_0_18px_rgba(124,58,237,0.35)]">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-[16px] font-bold text-white">{title}</span>
        <span className="mt-1 block text-[13px] leading-snug text-white/50">{description}</span>
      </span>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="text-white/30 transition group-hover:translate-x-0.5 group-hover:text-[#A78BFA]"
      >
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function TransferHome() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <TransferHeader title="Transfer" onClose={() => navigate(-1)} />

      <div className="flex flex-col gap-4 px-4 pb-10 pt-6 sm:px-6">
        <OptionCard
          title="Internal Transfer"
          description="Send crypto instantly to another SafeTrade user."
          onClick={() => navigate("/transfer/internal")}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 7h10m0 0l-3-3m3 3l-3 3M17 17H7m0 0l3 3m-3-3l3-3"
                stroke="#A78BFA"
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
          onClick={() => navigate("/transfer/external")}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8.5" stroke="#60A5FA" strokeWidth="2" />
              <path d="M3.5 12h17M12 3.5c2.2 2.3 3.4 5.2 3.4 8.5s-1.2 6.2-3.4 8.5c-2.2-2.3-3.4-5.2-3.4-8.5S9.8 5.8 12 3.5z" stroke="#60A5FA" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
