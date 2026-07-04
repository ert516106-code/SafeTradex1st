import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { TrendingUp, TrendingDown, Minus, RefreshCw, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import KYCReviewPanel from '../components/KYCReviewPanel';
import AccountBindingsPanel from '../components/AccountBindingsPanel';
import WithdrawalRequestsPanel from '../components/WithdrawalRequestsPanel';
import DepositAddressPanel from '../components/DepositAddressPanel';

export default function AdminDashboard() {
  const [balances, setBalances] = useState([]);
  const [countries, setCountries] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [activeTab, setActiveTab] = useState('accounts');

  const loadData = async () => {
    setLoading(true);
    const [bals, users] = await Promise.all([
      base44.entities.UserBalance.list(),
      base44.entities.User.list(),
    ]);
    setBalances(bals);
    setCountries(Object.fromEntries(users.map(u => [u.email, u.country])));
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const setMode = async (record, mode) => {
    setUpdating(u => ({ ...u, [record.id]: true }));
    let profitDelta = 0;
    if (mode === 'win') profitDelta = +(Math.random() * 500 + 50).toFixed(2);
    if (mode === 'lose') profitDelta = -(Math.random() * 300 + 50).toFixed(2);
    const newBalance = Math.max(0, (record.balance ?? 0) + profitDelta);
    await base44.entities.UserBalance.update(record.id, { balance: newBalance, today_profit: profitDelta, mode });
    toast.success(`${record.user_email} set to ${mode.toUpperCase()}`);
    await loadData();
    setUpdating(u => ({ ...u, [record.id]: false }));
  };

  const setCustomAmount = async (record, amount) => {
    if (isNaN(amount)) return;
    setUpdating(u => ({ ...u, [record.id]: true }));
    await base44.entities.UserBalance.update(record.id, { balance: parseFloat(amount), today_profit: 0 });
    toast.success(`Balance updated for ${record.user_email}`);
    await loadData();
    setUpdating(u => ({ ...u, [record.id]: false }));
  };

  const setCoinBalance = async (record, symbol, name, amount) => {
    if (isNaN(amount) || amount === '') return;
    setUpdating(u => ({ ...u, [`${record.id}_${symbol}`]: true }));
    const holdings = await base44.entities.CoinHolding.filter({ user_email: record.user_email });
    const existing = holdings.find(h => h.symbol === symbol);
    if (existing) {
      await base44.entities.CoinHolding.update(existing.id, { amount: parseFloat(amount) });
    } else {
      await base44.entities.CoinHolding.create({ user_email: record.user_email, symbol, name, amount: parseFloat(amount) });
    }
    toast.success(`${symbol} balance set for ${record.user_email}`);
    setUpdating(u => ({ ...u, [`${record.id}_${symbol}`]: false }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-inter pb-10">
      <div className="bg-gray-900 border-b border-gray-800 px-5 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">
            🎛️ Admin <span className="text-primary">Control Panel</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Demo Trading Platform — Internal Use Only</p>
        </div>
        <button onClick={loadData} className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center">
          <RefreshCw className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      <div className="flex gap-1 mx-5 mt-4 bg-gray-900 rounded-xl p-1">
        {[['accounts', '👥 Accounts'], ['kyc', '🪪 KYC'], ['bindings', '🔗 Bindings'], ['withdrawals', '💸 Withdrawals'], ['addresses', '📬 Addresses']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === key ? 'bg-primary text-white' : 'text-gray-400'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'kyc' && <KYCReviewPanel />}
      {activeTab === 'bindings' && <AccountBindingsPanel />}
      {activeTab === 'withdrawals' && <WithdrawalRequestsPanel />}
      {activeTab === 'addresses' && <DepositAddressPanel />}

      {activeTab === 'accounts' && (
        <>
          <div className="grid grid-cols-3 gap-3 px-5 pt-5 pb-4">
            <div className="bg-gray-900 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{balances.length}</p>
              <p className="text-xs text-gray-400">Accounts</p>
            </div>
            <div className="bg-emerald-900/40 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">{balances.filter(b => b.mode === 'win').length}</p>
              <p className="text-xs text-gray-400">Winning</p>
            </div>
            <div className="bg-red-900/40 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-red-400">{balances.filter(b => b.mode === 'lose').length}</p>
              <p className="text-xs text-gray-400">Losing</p>
            </div>
          </div>

          <div className="mx-5 mb-5 bg-gray-900 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-400 tracking-widest mb-3">GLOBAL CONTROLS</p>
            <div className="flex gap-3">
              <button onClick={async () => { for (const b of balances) await setMode(b, 'win'); }}
                className="flex-1 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 font-bold text-sm flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" /> ALL WIN
              </button>
              <button onClick={async () => { for (const b of balances) await setMode(b, 'lose'); }}
                className="flex-1 h-11 rounded-full bg-red-600 hover:bg-red-500 font-bold text-sm flex items-center justify-center gap-2">
                <TrendingDown className="w-4 h-4" /> ALL LOSE
              </button>
              <button onClick={async () => { for (const b of balances) { await base44.entities.UserBalance.update(b.id, { today_profit: 0, mode: 'neutral' }); } toast.success('All accounts reset'); loadData(); }}
                className="flex-1 h-11 rounded-full bg-gray-700 hover:bg-gray-600 font-bold text-sm flex items-center justify-center gap-2">
                <Minus className="w-4 h-4" /> RESET
              </button>
            </div>
          </div>

          <div className="px-5 space-y-4">
            <p className="text-xs font-semibold text-gray-400 tracking-widest">USER ACCOUNTS</p>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="bg-gray-900 rounded-2xl p-4 animate-pulse h-32" />)}
              </div>
            ) : balances.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>No accounts found.</p>
                <p className="text-xs mt-1">Users will appear here after they log in.</p>
              </div>
            ) : (
              balances.map(record => (
                <UserCard
                  key={record.id}
                  record={record}
                  country={countries[record.user_email]}
                  isUpdating={!!updating[record.id]}
                  onWin={() => setMode(record, 'win')}
                  onLose={() => setMode(record, 'lose')}
                  onNeutral={() => setMode(record, 'neutral')}
                  onSetAmount={(amt) => setCustomAmount(record, amt)}
                  onSetCoin={(symbol, name, amt) => setCoinBalance(record, symbol, name, amt)}
                  updatingKey={(symbol) => !!updating[`${record.id}_${symbol}`]}
                  />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

const COINS = [
  { symbol: 'BTC',  name: 'Bitcoin' },
  { symbol: 'ETH',  name: 'Ethereum' },
  { symbol: 'SOL',  name: 'Solana' },
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'USDT', name: 'Tether USD' },
];

function UserCard({ record, country, isUpdating, onWin, onLose, onNeutral, onSetAmount, onSetCoin, updatingKey }) {
  const [customAmt, setCustomAmt] = useState('');
  const [showCoins, setShowCoins] = useState(false);
  const [coinAmts, setCoinAmts] = useState({});
  const mode = record.mode || 'neutral';

  const modeColor = {
    win: 'border-emerald-500 bg-emerald-900/20',
    lose: 'border-red-500 bg-red-900/20',
    neutral: 'border-gray-700 bg-gray-900',
  }[mode];

  return (
    <div className={`rounded-2xl border p-4 ${modeColor} transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-sm truncate max-w-[180px]">{record.user_email}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Region: <span className={country ? 'text-white font-bold' : 'text-amber-400 font-bold'}>{country || 'Not set'}</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Balance: <span className="text-white font-bold">{(record.balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT</span>
          </p>
          <p className={`text-xs mt-0.5 ${(record.today_profit ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            Today: {(record.today_profit ?? 0) >= 0 ? '+' : ''}{(record.today_profit ?? 0).toFixed(2)}
          </p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          mode === 'win' ? 'bg-emerald-500 text-white' :
          mode === 'lose' ? 'bg-red-500 text-white' :
          'bg-gray-700 text-gray-300'
        }`}>
          {mode.toUpperCase()}
        </span>
      </div>

      <div className="flex gap-2 mb-3">
        <button disabled={isUpdating} onClick={onWin}
          className={`flex-1 h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 ${mode === 'win' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-emerald-700'}`}>
          <TrendingUp className="w-3 h-3" /> WIN
        </button>
        <button disabled={isUpdating} onClick={onLose}
          className={`flex-1 h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 ${mode === 'lose' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-red-700'}`}>
          <TrendingDown className="w-3 h-3" /> LOSE
        </button>
        <button disabled={isUpdating} onClick={onNeutral}
          className={`flex-1 h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 ${mode === 'neutral' ? 'bg-gray-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-600'}`}>
          <Minus className="w-3 h-3" /> NEUTRAL
        </button>
      </div>

      {/* USDT balance */}
      <div className="flex gap-2 mb-2">
        <div className="flex-1 flex items-center bg-gray-800 rounded-full px-3 gap-1">
          <DollarSign className="w-3 h-3 text-gray-400 shrink-0" />
          <input type="number" placeholder="Set USDT balance" value={customAmt}
            onChange={e => setCustomAmt(e.target.value)}
            className="bg-transparent text-xs text-white outline-none w-full py-2 placeholder-gray-500" />
        </div>
        <button disabled={isUpdating || !customAmt}
          onClick={() => { onSetAmount(customAmt); setCustomAmt(''); }}
          className="px-4 h-9 rounded-full bg-primary text-white text-xs font-bold disabled:opacity-40">
          Set USDT
        </button>
      </div>

      {/* Toggle Coin Balances */}
      <button onClick={() => setShowCoins(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 rounded-xl text-xs text-gray-300 font-semibold mb-2">
        <span>💰 Set Coin Balances (BTC, ETH, SOL, USDC)</span>
        {showCoins ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {showCoins && (
        <div className="space-y-2 mb-2">
          {COINS.filter(c => c.symbol !== 'USDT').map(({ symbol, name }) => (
            <div key={symbol} className="flex gap-2">
              <div className="flex-1 flex items-center bg-gray-800 rounded-full px-3 gap-1">
                <span className="text-[10px] text-gray-400 w-8 shrink-0">{symbol}</span>
                <input type="number" placeholder={`Amount`} value={coinAmts[symbol] ?? ''}
                  onChange={e => setCoinAmts(prev => ({ ...prev, [symbol]: e.target.value }))}
                  className="bg-transparent text-xs text-white outline-none w-full py-2 placeholder-gray-500" />
              </div>
              <button
                disabled={updatingKey(symbol) || !coinAmts[symbol]}
                onClick={() => { onSetCoin(symbol, name, coinAmts[symbol]); setCoinAmts(prev => ({ ...prev, [symbol]: '' })); }}
                className="px-3 h-9 rounded-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold disabled:opacity-40">
                Set
              </button>
            </div>
          ))}
        </div>
      )}

      {isUpdating && <div className="mt-2 text-center text-xs text-gray-400 animate-pulse">Updating...</div>}
    </div>
  );
}
