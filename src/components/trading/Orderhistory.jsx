import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, FileText, Search } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { getUserTrades } from "../../services/tradeService";

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function OrderHistory() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadTrades() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        if (active) setLoading(false);
        return;
      }

      try {
        const data = await getUserTrades(user.id);
        if (active) setTrades(data);
      } catch (err) {
        console.error("Failed to load trade history:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTrades();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-2.5 py-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[76px] rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!trades.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center mt-2">
        <div className="relative mb-4 text-slate-500">
          <FileText className="w-12 h-12 stroke-1" />
          <Search className="w-4 h-4 absolute -bottom-1 -right-1 stroke-2 text-slate-400" />
        </div>
        <p className="text-sm font-bold text-slate-300">No trade history</p>
        <p className="text-xs text-slate-500 mt-1.5 font-medium">
          Completed trades will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 py-1">
      {trades.map((trade) => {
        const isWin = trade.result === "win";
        const isLong = trade.direction === "long";

        return (
          <div
            key={trade.id}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.06] transition-all duration-200"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                isWin ? "bg-emerald-500/15" : "bg-rose-500/15"
              }`}
            >
              {isLong ? (
                <TrendingUp className={`w-5 h-5 ${isWin ? "text-emerald-400" : "text-rose-400"}`} />
              ) : (
                <TrendingDown className={`w-5 h-5 ${isWin ? "text-emerald-400" : "text-rose-400"}`} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white">{trade.coin}/USDT</p>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                    isLong ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  {isLong ? "Long" : "Short"}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                    isWin ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  {isWin ? "Win" : "Loss"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs font-medium text-slate-400">
                <span>{trade.timeframe}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span>{Number(trade.amount).toLocaleString()} USDT</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span>
                  Entry: <span className="text-slate-200 font-semibold">${Number(trade.entry_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </span>
              </div>

              <p className="text-[11px] text-slate-500 mt-1">{timeAgo(trade.created_at)}</p>
            </div>

            <div className="shrink-0 flex flex-col items-end">
              <p className={`text-sm font-bold ${isWin ? "text-emerald-400" : "text-rose-400"}`}>
                {isWin ? "+" : "-"}{Math.abs(Number(trade.profit)).toFixed(2)} USDT
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Exit: ${Number(trade.exit_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
