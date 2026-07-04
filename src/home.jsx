import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Eye, EyeOff, HandCoins, ArrowLeftRight, Download, Megaphone, FileText, Calculator, Users, TrendingUp, Bell } from 'lucide-react';
import FloatingSupport from '../components/FloatingSupport';
import CoinLogo from '../components/CoinLogo';
import LiveMarketStrip from '../components/LiveMarketStrip';
import { fetchLivePrices } from '@/lib/livePrices';
import ProfileDrawer from '../components/ProfileDrawer';
import DownloadModal from '../components/DownloadModal';
import DepositModal from '../components/DepositModal';
import AddFundsModal from '../components/AddFundsModal';
import WithdrawModal from '../components/WithdrawModal';
import ConvertModal from '../components/ConvertModal';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BANNER_URL = "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=600&h=250&fit=crop";

const quickActions = [
{ icon: HandCoins, label: 'Assistance\nloan' },
{ icon: ArrowLeftRight, label: 'Convert' },
{ icon: Download, label: 'Download', action: 'download' },
{ icon: Megaphone, label: 'Promotion\nCenter' },
{ icon: FileText, label: 'Delivery\ncontract', path: '/trade' },
{ icon: Calculator, label: 'Quant' },
{ icon: Users, label: 'Copy\nTrading' },
];


export default function Home() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [todayProfit, setTodayProfit] = useState(0);
  const [hideBalance, setHideBalance] = useState(false);
  const [topAssets, setTopAssets] = useState([
    { symbol: 'BTC', name: 'Bitcoin', price: 63638.00, change: 2.35 },
    { symbol: 'ETH', name: 'Ethereum', price: 1673.64, change: 1.87 },
    { symbol: 'SOL', name: 'Solana', price: 66.78, change: 3.21 },
    { symbol: 'BNB', name: 'BNB', price: 605.07, change: -0.54 },
  ]);

  useEffect(() => {
    base44.auth.me().then((user) => {
      base44.entities.UserBalance.filter({ user_email: user.email }).then((records) => {
        if (records.length > 0) {
          setBalance(records[0].balance ?? 0);
          setTodayProfit(records[0].today_profit ?? 0);
        }
      });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const load = () => fetchLivePrices(topAssets.map(a => a.symbol)).then(data => {
      if (!Object.keys(data).length) return;
      setTopAssets(prev => prev.map(a => data[a.symbol] ? { ...a, price: data[a.symbol].price, change: data[a.symbol].change } : a));
    });
    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background font-inter pb-20">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Ascend<span className="text-primary">ex</span></h1>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center relative">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button onClick={() => setProfileOpen(true)} className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">👤</span>
          </button>
        </div>
      </div>

      {/* Live indicator */}
      <div className="px-5 pb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-emerald-500" />
        <span className="text-xs text-muted-foreground font-medium">Market is live</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
      </div>

      {/* Balance Card */}
      <div className="mx-5 bg-gradient-to-br from-slate-900 via-slate-800 to-primary rounded-2xl p-5 text-white mb-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
            Account Balance (USDT)
            <button onClick={() => setHideBalance(!hideBalance)}>
              {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-4xl font-extrabold tracking-tight mb-2">
            {hideBalance ? '••••••' : balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-sm font-semibold ${todayProfit >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
              Today {todayProfit >= 0 ? '+' : ''}{hideBalance ? '***' : todayProfit.toFixed(2)} USDT
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/60">Trade-based</span>
          </div>
          <div className="flex gap-3">
            <Button className="flex-1 h-10 rounded-full font-semibold text-sm bg-white text-slate-900 hover:bg-white/90" onClick={() => setAddFundsOpen(true)}>Add Funds</Button>
            <Button variant="outline" className="flex-1 h-10 rounded-full font-semibold text-sm border-white/30 text-white hover:bg-white/10 bg-transparent" onClick={() => setWithdrawOpen(true)}>Withdraw</Button>
          </div>
        </div>
      </div>

      {/* Live Market */}
      <LiveMarketStrip />

      {/* Banner */}
      <div className="mx-5 rounded-2xl overflow-hidden mb-6">
        <img src="https://media.base44.com/images/public/6a12a15c87e6220c38a85686/dae38c22d_e0a57ec6-a640-4a0c-b140-0d41c2bb9697.png" alt="Crypto banner" className="w-full h-40 object-cover" />
      </div>

      {/* Top Assets */}
      <div className="mx-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">Top Assets</h2>
          <button onClick={() => navigate('/markets')} className="text-xs text-primary font-semibold">View all</button>
        </div>
        {topAssets.map(asset => (
          <div key={asset.symbol} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <CoinLogo symbol={asset.symbol} size="sm" />
              <div>
                <p className="font-semibold text-sm">{asset.name}</p>
                <p className="text-xs text-muted-foreground">{asset.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm">{asset.price < 1 ? `$${asset.price.toFixed(4)}` : `$${asset.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}</p>
              <p className={`text-xs font-medium ${asset.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 mx-5">
        {quickActions.map(({ icon: Icon, label, path, action, url }) =>
        <button key={label} onClick={() => {if (action === 'download') setDownloadOpen(true);else if (label === 'Convert') setConvertOpen(true);else if (url) window.open(url, '_blank');else if (path) navigate(path);}} className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-[11px] text-center leading-tight text-muted-foreground whitespace-pre-line my-5">{label}</span>
          </button>
        )}
      </div>

      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />
      <AddFundsModal open={addFundsOpen} onClose={() => setAddFundsOpen(false)} onDepositCrypto={() => setDepositOpen(true)} />
      <DownloadModal open={downloadOpen} onClose={() => setDownloadOpen(false)} />
      <WithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
      <ConvertModal open={convertOpen} onClose={() => setConvertOpen(false)} />
      <FloatingSupport />
    </div>);

}
