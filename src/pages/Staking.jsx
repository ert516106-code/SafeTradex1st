import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Lock, Unlock, RefreshCw, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import CoinLogo from '../components/CoinLogo';
import StakeModal from '../components/StakeModal';
import TransferToStakingModal from '../components/TransferToStakingModal';
import TransactionHistory from '../components/TransactionHistory';

const STAKING_RATES = {
  USDT: { apr: 8.5,  minAmount: 10,   lockDays: 7  },
  BTC:  { apr: 5.2,  minAmount: 0.001, lockDays: 14 },
  ETH:  { apr: 6.8,  minAmount: 0.01,  lockDays: 14 },
  SOL:  { apr: 12.4, minAmount: 0.1,   lockDays: 7  },
  BNB:  { apr: 9.1,  minAmount: 0.05,  lockDays: 7  },
  ADA:  { apr: 7.3,  minAmount: 10,    lockDays: 7  },
  XRP:  { apr: 6.0,  minAmount: 10,    lockDays: 7  },
};

export default function Staking() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('assets');
  const [userEmail, setUserEmail] = useState('');
  const [balance, setBalance] = useState(0);
  const [coinHoldings, setCoinHoldings] = useState([]);
  const [stakingRecords, setStakingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stakeModal, setStakeModal] = useState({ open: false, coin: null, available: 0 });
  const [transferOpen, setTransferOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const user = await base44.auth.me().catch(() => null);
    if (!user) { setLoading(false); return; }
    setUserEmail(user.email);

    const [balRecords, holdings, staking] = await Promise.all([
      base44.entities.UserBalance.filter({ user_email: user.email }),
      base44.entities.CoinHolding.filter({ user_email: user.email }),
      base44.entities.StakingRecord.filter({ user_email: user.email }),
    ]);

    if (balRecords.length > 0) setBalance(balRecords[0].balance ?? 0);
    setCoinHoldings(holdings);
    setStakingRecords(staking);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // Total staked value in USDT (approximate)
  const totalStaked = stakingRecords
    .filter(r => r.status === 'active')
    .reduce((sum, r) => sum + (r.coin === 'USDT' ? r.amount : r.amount), 0);

  const totalRewards = stakingRecords
    .filter(r => r.status === 'active')
    .reduce((sum, r) => sum + (r.rewards_earned ?? 0), 0);

  // Build available coins list (USDT balance + coin holdings)
  const availableCoins = [
    { symbol: 'USDT', name: 'Tether USD', available: balance },
    ...coinHoldings.filter(h => h.amount > 0 && STAKING_RATES[h.symbol]).map(h => ({
      symbol: h.symbol, name: h.name, available: h.amount,
    })),
  ].filter(c => STAKING_RATES[c.symbol]);

  const handleStakeSuccess = () => {
    setStakeModal({ open: false, coin: null, available: 0 });
    loadData();
  };

  return (
    <div className="min-h-screen bg-background font-inter pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Staking</h1>
        <button onClick={loadData} className="ml-auto">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Summary Card */}
      <div className="mx-5 bg-gradient-to-br from-slate-900 via-slate-800 to-primary rounded-2xl p-5 text-white mb-5">
        <p className="text-xs text-white/60 mb-1">Total Staked Value</p>
        <p className="text-3xl font-extrabold mb-1">{totalStaked.toFixed(4)}</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 bg-white/10 rounded-xl p-3">
            <p className="text-[10px] text-white/60 mb-0.5">Rewards Earned</p>
            <p className="text-sm font-bold text-emerald-300">+{totalRewards.toFixed(6)}</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3">
            <p className="text-[10px] text-white/60 mb-0.5">Active Stakes</p>
            <p className="text-sm font-bold">{stakingRecords.filter(r => r.status === 'active').length}</p>
          </div>
        </div>
        <button onClick={() => setTransferOpen(true)}
          className="w-full mt-4 h-10 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
          <ArrowLeftRight className="w-4 h-4" /> Transfer to Staking
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 border-b border-border mb-4">
        {[['assets', 'Assets'], ['history', 'History']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`pb-3 px-4 text-sm font-semibold ${tab === key ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'history' ? (
        <div className="px-5">
          <StakingHistory records={stakingRecords} />
        </div>
      ) : (
        <div className="px-5">
          {/* Available to Stake */}
          <h3 className="font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Available to Stake</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-secondary rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {availableCoins.map(coin => {
                const rate = STAKING_RATES[coin.symbol];
                return (
                  <div key={coin.symbol} className="border border-border rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CoinLogo symbol={coin.symbol} size="sm" />
                        <div>
                          <p className="font-bold text-sm">{coin.symbol}</p>
                          <p className="text-xs text-muted-foreground">Available: {coin.available.toLocaleString('en-US', { maximumFractionDigits: 6 })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-500 font-bold text-sm">{rate.apr}% APR</p>
                        <p className="text-[10px] text-muted-foreground">{rate.lockDays}d lock</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setStakeModal({ open: true, coin: coin.symbol, available: coin.available })}
                      className="w-full mt-3 h-9 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      <Lock className="w-3.5 h-3.5" />
                      Stake {coin.symbol}
                    </button>
                  </div>
                );
              })}
              {availableCoins.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">No coins available to stake. Convert USDT first.</p>
              )}
            </div>
          )}

          {/* Active Stakes */}
          {stakingRecords.filter(r => r.status === 'active').length > 0 && (
            <>
              <h3 className="font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Active Stakes</h3>
              <div className="space-y-3">
                {stakingRecords.filter(r => r.status === 'active').map(record => {
                  const rate = STAKING_RATES[record.coin] || {};
                  const daysLeft = record.end_date
                    ? Math.max(0, Math.ceil((new Date(record.end_date) - new Date()) / (1000 * 60 * 60 * 24)))
                    : rate.lockDays;
                  return (
                    <div key={record.id} className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CoinLogo symbol={record.coin} size="sm" />
                          <div>
                            <p className="font-bold text-sm">{record.coin}</p>
                            <p className="text-xs text-muted-foreground">Staked: {record.amount}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-600 font-bold text-sm">{record.apr}% APR</p>
                          <p className="text-[10px] text-muted-foreground">{daysLeft}d left</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs text-emerald-600 font-semibold">
                          +{(record.rewards_earned ?? 0).toFixed(6)} earned
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      <TransferToStakingModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        coins={availableCoins}
        onSelect={(coin) => { setTransferOpen(false); setStakeModal({ open: true, coin: coin.symbol, available: coin.available }); }}
      />

      <StakeModal
        open={stakeModal.open}
        coin={stakeModal.coin}
        available={stakeModal.available}
        apr={stakeModal.coin ? STAKING_RATES[stakeModal.coin]?.apr : 0}
        lockDays={stakeModal.coin ? STAKING_RATES[stakeModal.coin]?.lockDays : 0}
        minAmount={stakeModal.coin ? STAKING_RATES[stakeModal.coin]?.minAmount : 0}
        onClose={() => setStakeModal({ open: false, coin: null, available: 0 })}
        onSuccess={handleStakeSuccess}
        userEmail={userEmail}
      />
    </div>
  );
}

function StakingHistory({ records }) {
  if (records.length === 0) {
    return <p className="text-center text-muted-foreground text-sm py-8">No staking history yet.</p>;
  }
  return (
    <div className="space-y-3">
      {[...records].reverse().map(r => (
        <div key={r.id} className="border border-border rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CoinLogo symbol={r.coin} size="sm" />
            <div>
              <p className="font-bold text-sm">{r.coin} Stake</p>
              <p className="text-xs text-muted-foreground">{r.start_date ? new Date(r.start_date).toLocaleDateString() : '—'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm">{r.amount} {r.coin}</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'}`}>
              {r.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
