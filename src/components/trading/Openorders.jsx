import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, FileText, Search } from "lucide-react";
import { useActiveOrders } from "../../lib/orderStore";

export { addActiveOrder, removeActiveOrder, updateActiveOrder } from "../../lib/orderStore";

function CountdownBadge({ remainingSeconds, totalSeconds }) {
  const percent = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;
  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const ss = String(remainingSeconds % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-end gap-1.5">
      <span className="text-xs font-bold text-blue-400 tracking-wide">
        {mm}:{ss}
      </span>
      <div className="w-16 h-1 rounded-full bg-slate-700/50 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function OpenOrders() {
  const orders = useActiveOrders();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate((v) => v + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // PREMIUM EMPTY STATE
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center mt-2">
        <div className="relative mb-4 text-slate-500">
          <FileText className="w-12 h-12 stroke-1" />
          <Search className="w-4 h-4 absolute -bottom-1 -right-1 stroke-2 text-slate-400" />
        </div>
        <p className="text-sm font-bold text-slate-300">No open orders</p>
        <p className="text-xs text-slate-500 mt-1.5 font-medium">
          Place a trade to see active positions here
        </p>
      </div>
    );
  }

  // PROFESSIONAL LIST
  return (
    <div className="flex flex-col gap-2.5 py-1">
      {orders.map((order) => {
        const elapsed = Math.floor((Date.now() - order.startTime) / 1000);
        const remaining = Math.max(0, order.totalSeconds - elapsed);
        const isLong = order.direction === "Long";

        return (
          <div
            key={order.id}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.06] transition-all duration-200"
          >
            {/* Status Icon Box */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                isLong ? "bg-emerald-500/15" : "bg-rose-500/15"
              }`}
            >
              {isLong ? (
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-rose-400" />
              )}
            </div>

            {/* Trade Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white">{order.coin}/USDT</p>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                  isLong ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                }`}>
                  {isLong ? "Long" : "Short"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs font-medium text-slate-400">
                <span>{order.period}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span>{Number(order.amount).toLocaleString()} USDT</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span>Entry: <span className="text-slate-200 font-semibold">${Number(order.entryPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></span>
              </div>
            </div>

            {/* Countdown & Target */}
            <div className="shrink-0 flex flex-col items-end">
              <CountdownBadge remainingSeconds={remaining} totalSeconds={order.totalSeconds} />
              <p className="text-xs text-emerald-400 font-bold mt-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                +{order.potentialWin} USDT
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
