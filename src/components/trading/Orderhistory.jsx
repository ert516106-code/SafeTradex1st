import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useActiveOrders } from "../../lib/orderStore";

export default function OrderHistory() {
  const orders = useActiveOrders();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-secondary animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-3">
          <TrendingDown className="w-6 h-6 text-muted-foreground" />
        </div>

        <p className="text-sm font-semibold text-muted-foreground">
          No trade history
        </p>

        <p className="text-xs text-muted-foreground mt-1">
          Completed trades will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {orders.map((order) => {
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
                {order.direction} • {order.period}
              </p>

              <p className="text-xs text-muted-foreground">
                Entry:{" "}
                {Number(order.entryPrice).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="font-bold text-sm text-primary">
                {Number(order.amount).toLocaleString()} USDT
              </p>

              <span className="text-xs text-muted-foreground">
                Active
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
