import { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CoinLogo from './CoinLogo';

export default function StakeModal({ open, coin, available, apr, lockDays, minAmount, onClose, onSuccess, userEmail }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open || !coin) return null;

  const numAmount = parseFloat(amount) || 0;
  const estimatedReward = numAmount * (apr / 100) * (lockDays / 365);
  const endDate = new Date(Date.now() + lockDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleStake = async () => {
    setError('');
    if (numAmount < minAmount) { setError(`Minimum stake is ${minAmount} ${coin}`); return; }
    if (numAmount > available) { setError('Insufficient balance'); return; }
    setLoading(true);

    // Deduct from balance/holding
    const user = await base44.auth.me();
    if (coin === 'USDT') {
      const balRecords = await base44.entities.UserBalance.filter({ user_email: user.email });
      if (balRecords.length > 0) {
        await base44.entities.UserBalance.update(balRecords[0].id, {
          balance: +(balRecords[0].balance - numAmount).toFixed(2),
        });
      }
    } else {
      const holdings = await base44.entities.CoinHolding.filter({ user_email: user.email });
      const holding = holdings.find(h => h.symbol === coin);
      if (holding) {
        await base44.entities.CoinHolding.update(holding.id, {
          amount: +(holding.amount - numAmount),
        });
      }
    }

    // Create staking record
    await base44.entities.StakingRecord.create({
      user_email: userEmail,
      coin,
      amount: numAmount,
      apr,
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      end_date: endDate,
      rewards_earned: 0,
    });

    setLoading(false);
    setAmount('');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full max-w-lg bg-background rounded-t-3xl p-6 pb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <CoinLogo symbol={coin} size="sm" />
            <h2 className="text-lg font-bold">Stake {coin}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-secondary rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">APR</p>
            <p className="text-emerald-500 font-bold text-sm">{apr}%</p>
          </div>
          <div className="bg-secondary rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Lock Period</p>
            <p className="font-bold text-sm">{lockDays} days</p>
          </div>
          <div className="bg-secondary rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Min Amount</p>
            <p className="font-bold text-sm">{minAmount}</p>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-semibold">Amount</label>
            <span className="text-xs text-muted-foreground">Available: {available.toLocaleString('en-US', { maximumFractionDigits: 6 })} {coin}</span>
          </div>
          <div className="flex items-center border border-border rounded-xl px-4 h-12 gap-2">
            <input
              type="number"
              className="flex-1 bg-transparent outline-none text-sm font-semibold"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <button onClick={() => setAmount(String(available))} className="text-xs text-primary font-semibold">MAX</button>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Estimated Reward */}
        {numAmount > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-5">
            <p className="text-xs text-emerald-700 font-semibold">
              Estimated reward after {lockDays} days: +{estimatedReward.toFixed(6)} {coin}
            </p>
          </div>
        )}

        <button
          onClick={handleStake}
          disabled={loading || numAmount <= 0}
          className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Lock className="w-4 h-4" /> Confirm Stake</>
          )}
        </button>
      </div>
    </div>
  );
}
