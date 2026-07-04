import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { TrendingUp, TrendingDown, Download, Upload, Clock, CheckCircle, XCircle } from 'lucide-react';

const typeConfig = {
  deposit:    { label: 'Deposit',    icon: Download,    color: 'text-blue-500',    bg: 'bg-blue-500/10' },
  trade_win:  { label: 'Trade Win',  icon: TrendingUp,  color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  trade_lose: { label: 'Trade Lose', icon: TrendingDown, color: 'text-red-500',    bg: 'bg-red-500/10' },
};

export default function TransactionHistory() {
  const [txns, setTxns] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async user => {
      const [txData, wdData] = await Promise.all([
        base44.entities.Transaction.filter({ user_email: user.email }, '-created_date', 50),
        base44.entities.WithdrawalRequest.filter({ user_email: user.email }, '-created_date', 50),
      ]);
      setTxns(txData);
      setWithdrawals(wdData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-3 pt-4">
      {[1,2,3,4].map(i => <div key={i} className="h-16 bg-secondary rounded-xl animate-pulse" />)}
    </div>
  );

  const hasData = txns.length > 0 || withdrawals.length > 0;

  if (!hasData) return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <span className="text-4xl mb-3">📋</span>
      <p className="font-medium">No transactions yet</p>
      <p className="text-xs mt-1">Your deposits, trades and withdrawals will appear here</p>
    </div>
  );

  // Merge and sort by date
  const allItems = [
    ...txns.map(t => ({ ...t, _type: 'transaction' })),
    ...withdrawals.map(w => ({ ...w, _type: 'withdrawal' })),
  ].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  return (
    <div className="pt-4 space-y-3">
      {allItems.map(item => {
        const date = new Date(item.created_date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        if (item._type === 'withdrawal') {
          const statusConfig = {
            pending:  { icon: Clock,        color: 'text-amber-500',   bg: 'bg-amber-500/10',   label: 'Pending' },
            approved: { icon: CheckCircle,   color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Success' },
            rejected: { icon: XCircle,       color: 'text-red-500',     bg: 'bg-red-500/10',     label: 'Rejected' },
          }[item.status] || { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Pending' };

          const StatusIcon = statusConfig.icon;

          return (
            <div key={`wd-${item.id}`} className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3">
              <div className={`w-10 h-10 rounded-full ${statusConfig.bg} flex items-center justify-center shrink-0`}>
                <Upload className={`w-5 h-5 ${statusConfig.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Withdrawal</p>
                <p className="text-xs text-muted-foreground truncate">{item.coin} · {item.network}</p>
                <p className="text-xs text-muted-foreground">{dateStr} {timeStr}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm text-red-500">-{item.amount}</p>
                <div className={`flex items-center gap-1 justify-end mt-0.5`}>
                  <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
                  <p className={`text-xs font-semibold ${statusConfig.color}`}>{statusConfig.label}</p>
                </div>
              </div>
            </div>
          );
        }

        const cfg = typeConfig[item.type] || typeConfig.deposit;
        const Icon = cfg.icon;
        const isPositive = item.type !== 'trade_lose';

        return (
          <div key={`tx-${item.id}`} className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3">
            <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${cfg.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{cfg.label}</p>
              <p className="text-xs text-muted-foreground truncate">
                {item.coin ? `${item.coin} · ${item.direction ?? ''} · ${item.period ?? ''}` : item.note || '—'}
              </p>
              <p className="text-xs text-muted-foreground">{dateStr} {timeStr}</p>
            </div>
            <div className="text-right shrink-0">
              <p className={`font-bold text-sm ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {isPositive ? '+' : '-'}{Math.abs(item.amount).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">USDT</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
