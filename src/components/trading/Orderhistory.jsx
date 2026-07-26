import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { useTransactions } from '../../lib/orderStore';

export default function OrderHistory() {
  const transactions = useTransactions();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(id);
  }, []);

  const trades = useMemo(
    () => transactions.filter((tx) => tx.type === 'trade_win' || tx.type === 'trade_lose'),
    [transactions]
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-secondary rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-3">
          <TrendingDown className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-muted-foreground">No trade history</p>
        <p className="text-xs text-muted-foreground mt-1">Completed trades will appear here</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {trades.map((tx) => {
        const isWin = tx.type === 'trade_win';
        const isLong = tx.direction === 'Long';
        return (
          <div key={tx.id} className="px-4 py-3 flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                isWin ? 'bg-emerald-50' : 'bg-red-50'
              }`}
            >
              {isLong ? (
                <TrendingUp className={`w-4 h-4 ${isWin ? 'text-emerald-500' : 'text-red-500'}`} />
              ) : (
                <TrendingDown className={`w-4 h-4 ${isWin ? 'text-emerald-500' : 'text-red-500'}`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{tx.coin ? `${tx.coin}/USDT` : 'Trade'}</p>
              <p className="text-xs text-muted-foreground">
                {tx.direction ?? ''} · {tx.period ?? ''} · {isWin ? 'WIN' : 'LOSS'}
              </p>
              {tx.created_date && (
                <p className="text-xs text-muted-foreground">{format(new Date(tx.created_date), 'MMM d, HH:mm')}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className={`font-bold text-sm ${isWin ? 'text-emerald-500' : 'text-red-500'}`}>
                {isWin ? '+' : '-'}
                {tx.amount?.toFixed(2)} USDT
              </p>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isWin ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                }`}
              >
                {isWin ? 'WIN' : 'LOSS'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
