import React from "react";
import { TransferHeader, GlassCard, CoinLogo, getCoin, getAccount, formatAmount, MOCK_TRANSFER_HISTORY, AccountBadge } from "../../pages/Transfer";

const STATUS_STYLES = {
  Completed: { color: "#36F58B", bg: "rgba(54,245,139,0.12)" },
  Pending: { color: "#FBBF24", bg: "rgba(251,191,36,0.12)" },
  Failed: { color: "#FF5C7A", bg: "rgba(255,92,122,0.12)" },
};

function formatDateTime(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const datePart = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const timePart = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${datePart} · ${timePart}`;
}

export default function TransferHistory() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <TransferHeader title="Transfer History" />

      <div className="flex flex-1 flex-col gap-3 px-4 pb-10 pt-6 sm:px-6">
        {MOCK_TRANSFER_HISTORY.length === 0 && (
          <p className="px-2 py-14 text-center text-[13.5px] text-white/40">No transfers yet.</p>
        )}

        {MOCK_TRANSFER_HISTORY.map((tx, i) => {
          const coin = getCoin(tx.coinSymbol);
          const fromAccount = getAccount(tx.fromAccount);
          const toAccount = getAccount(tx.toAccount);
          const status = STATUS_STYLES[tx.status] || STATUS_STYLES.Pending;

          return (
            <GlassCard
              key={tx.id}
              className="flex flex-col gap-3 !p-4 transition-all duration-500"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <CoinLogo coin={coin} size={30} />
                  <span className="text-[15px] font-bold text-white">
                    {formatAmount(parseFloat(tx.amount), 6)} {coin.symbol}
                  </span>
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{ color: status.color, background: status.bg }}
                >
                  {tx.status}
                </span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5">
                <span className="flex items-center gap-2">
                  <AccountBadge account={fromAccount} size={26} />
                  <span className="text-[12.5px] font-semibold text-white/75">{fromAccount.name}</span>
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/30">
                  <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="flex items-center gap-2">
                  <AccountBadge account={toAccount} size={26} />
                  <span className="text-[12.5px] font-semibold text-white/75">{toAccount.name}</span>
                </span>
              </div>

              <span className="text-[12px] text-white/40">{formatDateTime(tx.date)}</span>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
