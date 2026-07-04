import { useState, useEffect } from 'react';
import { Eye, RefreshCw, Download, Upload, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import CoinLogo from '../components/CoinLogo';
import DepositModal from '../components/DepositModal';
import ConvertModal from '../components/ConvertModal';
import WithdrawModal from '../components/WithdrawModal';
import TransactionHistory from '../components/TransactionHistory';

const tabs = ['Assets', 'History'];
const actions = [
  { icon: Download, label: 'Deposit', action: 'deposit' },
  { icon: Upload, label: 'Withdraw', action: 'withdraw' },
  { icon: ArrowLeftRight, label: 'Convert', action: 'convert' },
  { icon: RefreshCw, label: 'Transfer' },
];

const COIN_COLORS = {
  USDT: 'bg-emerald-500', USDC: 'bg-blue-500', BTC: 'bg-orange-500',
  ETH: 'bg-indigo-500', SOL: 'bg-purple-500', BNB: 'bg-yellow-500',
};
const COIN_TEXT = {
  USDT: '₮', USDC: '$', BTC: '₿', ETH: 'Ξ', SOL: '◎', BNB: 'B',
};

const COINGECKO_IDS = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana',
  BNB: 'binancecoin', ADA: 'cardano', XRP: 'ripple', USDC: 'usd-coin',
};

async function fetchLivePrices(symbols) {
  const ids = symbols.map(s => COINGECKO_IDS[s]).filter(Boolean);
  if (!ids.length) return {};
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`);
    const data = await res.json();
    const result = {};
    symbols.forEach(s => {
      const id = COINGECKO_IDS[s];
      if (id && data[id]?.usd) result[s] = data[id].usd;
    });
    return result;
  } catch {
    return {};
  }
}

export default function Assets() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(tabs[0]);
  const [balance, setBalance] = useState(0);
  const [todayProfit, setTodayProfit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [depositOpen, setDepositOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [coinHoldings, setCoinHoldings] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const [prevPrices, setPrevPrices] = useState({});

  const loadData = async () => {
    const user = await base44.auth.me().catch(() => null);
    if (!user) { setLoading(false); return; }
    const records = await base44.entities.UserBalance.filter({ user_email: user.email });
    if (records.length > 0) {
      setBalance(records[0].balance ?? 0);
      setTodayProfit(records[0].today_profit ?? 0);
    } else {
      await base44.entities.UserBalance.create({ user_email: user.email, balance: 0, today_profit: 0 });
    }
    const holdings = await base44.entities.CoinHolding.filter({ user_email: user.email });
    setCoinHoldings(holdings);
    setLoading(false);
    // Fetch live prices for all held coins
    const symbols = holdings.filter(h => h.amount > 0 && h.symbol !== 'USDT' && h.symbol !== 'USDC').map(h => h.symbol);
    if (symbols.length) {
      const prices = await fetchLivePrices(symbols);
      setLivePrices(prices);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Tick live prices every 5s with small realistic random walk
  useEffect(() => {
    if (!Object.keys(livePrices).length) return;
    const interval = setInterval(() => {
      setLivePrices(prev => {
        const next = { ...prev };
        setPrevPrices({ ...prev });
        Object.keys(next).forEach(sym => {
          const pct = (Math.random() - 0.5) * 0.0012; // ±0.06% per tick
          next[sym] = +(next[sym] * (1 + pct)).toFixed(sym === 'BTC' || sym === 'ETH' ? 2 : 4);
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [livePrices]);

  // Reload holdings after convert modal closes
  const handleConvertClose = () => {
    setConvertOpen(false);
    loadData();
  };

  return (
    <div className="min-h-screen bg-background font-inter pb-20">
      <div className="flex gap-1 px-4 pt-5 border-b border-border">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap ${tab === t ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-5 pt-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          Account balance(USDT) <Eye className="w-4 h-4" />
          <button onClick={loadData}><RefreshCw className="w-4 h-4" /></button>
        </div>
        {loading ? (
          <div className="w-32 h-8 bg-secondary rounded animate-pulse mb-1" />
        ) : (
          <p className="text-3xl font-extrabold mb-1">{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        )}
        <p className={`text-sm font-medium mb-6 ${todayProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          Today&apos;s Profit {todayProfit >= 0 ? '+' : ''}{todayProfit.toFixed(2)}
        </p>

        <div className="flex justify-around mb-8">
          {actions.map(({ icon: Icon, label, action }) => (
            <div key={label} className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => { if (action === 'deposit') setDepositOpen(true); else if (action === 'convert') setConvertOpen(true); else if (action === 'withdraw') setWithdrawOpen(true); else if (label === 'Transfer') navigate('/staking'); }}>
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {tab === 'History' ? (
          <TransactionHistory />
        ) : (
          <>
            <h3 className="font-bold text-base mb-4">Asset Details</h3>

            {/* USDT row */}
            <div className="border border-border rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-3 mb-3">
                <CoinLogo symbol="USDT" size="sm" />
                <span className="font-bold text-base">USDT</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Available</p>
                  <p className="font-semibold">{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Occupation</p>
                  <p className="font-semibold">0.0000</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Equivalent(USDT)</p>
                  <p className="font-semibold">{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>

            {/* Converted coin holdings */}
            {coinHoldings.filter(h => h.amount > 0).map(holding => {
              const livePrice = livePrices[holding.symbol];
              const prevPrice = prevPrices[holding.symbol];
              const usdtValue = livePrice ? +(holding.amount * livePrice).toFixed(2) : null;
              const priceUp = livePrice && prevPrice ? livePrice >= prevPrice : null;
              return (
                <div key={holding.symbol} className="border border-border rounded-2xl p-4 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <CoinLogo symbol={holding.symbol} size="sm" />
                      <div>
                        <span className="font-bold text-base">{holding.symbol}</span>
                        <p className="text-xs text-muted-foreground">{holding.name}</p>
                      </div>
                    </div>
                    {livePrice && (
                      <div className="text-right">
                        <p className={`text-sm font-bold ${priceUp === true ? 'text-emerald-500' : priceUp === false ? 'text-red-500' : 'text-foreground'}`}>
                          ${livePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Market price</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-0.5">Available</p>
                      <p className="font-semibold">{holding.amount.toLocaleString('en-US', { maximumFractionDigits: 8 })}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-0.5">Occupation</p>
                      <p className="font-semibold">0.0000</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-0.5">Value (USDT)</p>
                      <p className={`font-semibold ${usdtValue !== null ? (priceUp === true ? 'text-emerald-500' : priceUp === false ? 'text-red-500' : '') : ''}`}>
                        {usdtValue !== null ? usdtValue.toLocaleString('en-US', { minimumFractionDigits: 2 }) : holding.symbol}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {coinHoldings.filter(h => h.amount > 0).length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-6">No other assets yet. Convert USDT to add coins.</p>
            )}
          </>
        )}
      </div>

      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />
      <ConvertModal open={convertOpen} onClose={handleConvertClose} />
      <WithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} onViewHistory={() => setTab('History')} />
    </div>
  );
}
