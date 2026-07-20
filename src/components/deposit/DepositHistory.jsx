import React from "react";
import { DepositHeader, GlassCard, MOCK_DEPOSIT_HISTORY } from "../../pages/Deposit";

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

export default function DepositHistory() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <DepositHeader title="Deposit History" />

      <div className="flex flex-1 flex-col gap-3 px-4 pb-10 pt-6 sm:px-6">
        {MOCK_DEPOSIT_HISTORY.length === 0 && (
          <p className="px-2 py-14 text-center text-[13.5px] text-white/40">No deposits yet.</p>
        )}

        {MOCK_DEPOSIT_HISTORY.map((tx) => {
          const status = STATUS_STYLES[tx.status] || STATUS_STYLES.Pending;
          return (
            <GlassCard key={tx.id} className="flex items-center justify-between gap-4 !p-4">
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-bold text-white">
                  {tx.coin} <span className="font-medium text-white/40">· {tx.network}</span>
                </span>
                <span className="text-[12px] text-white/40">{formatDateTime(tx.date)}</span>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span className="text-[14.5px] font-bold text-white">
                  +{tx.amount} {tx.coin}
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{ color: status.color, background: status.bg }}
                >
                  {tx.status}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
