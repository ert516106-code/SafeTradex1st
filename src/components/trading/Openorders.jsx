import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

import { useActiveOrders } from "../../lib/orderStore";

export {
  addActiveOrder,
  removeActiveOrder,
  updateActiveOrder,
} from "../../lib/orderStore";

function CountdownBadge({ remainingSeconds, totalSeconds }) {
  const percent =
    totalSeconds > 0
      ? (remainingSeconds / totalSeconds) * 100
      : 0;

  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const ss = String(remainingSeconds % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-end gap-1">
      <span className="text-xs font-bold text-primary">
        {mm}:{ss}
      </span>

      <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000"
          style={{
            width: `${percent}%`,
          }}
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

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-3">
          <TrendingUp className="w-6 h-6 text-muted-foreground" />
        </div>

        <p className="text-sm font-semibold text-muted-foreground">
          No open orders
        </p>

        <p className="text-xs text-muted-foreground mt-1">
          Place a trade to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {orders.map((order) => {
        const elapsed = Math.floor(
          (Date.now() - order.startTime) / 1000
        );

        const remaining = Math.max(
          0,
          order.totalSeconds - elapsed
        );

        const isLong = order.direction === "Long";

        return (
          <div
            key={order.id}
            className="px-4 py-3 flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                isLong ? "bg-emerald-50" : "bg-red-50"
              }`}
            >
              {isLong ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">
                {order.coin}/USDT
              </p>

              <p className="text-xs text-muted-foreground">
                {isLong ? "Buy Long" : "Sell Short"} •{" "}
                {order.period} •{" "}
                {Number(order.amount).toLocaleString()} USDT
              </p>

              <p className="text-xs text-muted-foreground">
                Entry:{" "}
                {Number(order.entryPrice).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="shrink-0">
              <CountdownBadge
                remainingSeconds={remaining}
                totalSeconds={order.totalSeconds}
              />

              <p className="text-xs text-emerald-500 font-medium text-right mt-1">
                +{order.potentialWin} USDT
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
