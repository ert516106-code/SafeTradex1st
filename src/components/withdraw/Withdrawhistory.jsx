import React, { useEffect, useState } from "react";
import { WithdrawHeader } from "../../pages/Withdraw";
import { supabase } from "../../lib/supabase";

const STATUS_STYLES = {
  pending: { label: "Pending", color: "#FBBF24" },
  approved: { label: "Completed", color: "#34D399" },
  rejected: { label: "Rejected", color: "#F87171" },
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function WithdrawHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) {
        if (!cancelled) {
          setError("You need to be signed in to view withdraw history.");
          setLoading(false);
        }
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("withdrawal_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <WithdrawHeader title="Withdraw History" />

      <div className="flex flex-1 flex-col gap-3 px-4 pb-10 pt-6 sm:px-6">
        {loading && (
          <p className="py-10 text-center text-[13px] text-white/40">Loading...</p>
        )}

        {!loading && error && (
          <p className="py-10 text-center text-[13px] text-red-400">{error}</p>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="text-[14px] font-semibold text-white">No withdrawals yet</p>
            <p className="text-[12.5px] text-white/40">Your withdrawal history will appear here.</p>
          </div>
        )}

        {!loading &&
          !error &&
          items.map((w) => {
            const statusInfo = STATUS_STYLES[w.status] || { label: w.status, color: "#9CA3AF" };
            const subtitle =
              w.type === "internal"
                ? `Internal${w.recipient_uid ? ` · to UID ${w.recipient_uid}` : ""}`
                : w.network
                ? `${w.network.toUpperCase()}`
                : "External";

            return (
              <div
                key={w.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5"
              >
                <div>
                  <p className="text-[14.5px] font-bold text-white">
                    {w.coin?.toUpperCase()} <span className="font-medium text-white/40">· {subtitle}</span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-white/40">{formatDate(w.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[14.5px] font-bold text-white">
                    -{Number(w.amount).toFixed(4)} {w.coin?.toUpperCase()}
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold" style={{ color: statusInfo.color }}>
                    {statusInfo.label}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
