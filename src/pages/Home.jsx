import { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  HandCoins,
  ArrowLeftRight,
  Download,
  Megaphone,
  FileText,
  Calculator,
  Users,
  TrendingUp,
  Bell
} from 'lucide-react';

import FloatingSupport from '../components/FloatingSupport';
import CoinLogo from '../components/CoinLogo';
import LiveMarketStrip from '../components/LiveMarketStrip';
import { fetchLivePrices } from '../lib/livePrices';
import ProfileDrawer from '../components/ProfileDrawer';
import DownloadModal from '../components/DownloadModal';
import DepositModal from '../components/DepositModal';
import AddFundsModal from '../components/AddFundsModal';
import WithdrawModal from '../components/WithdrawModal';
import ConvertModal from '../components/ConvertModal';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const quickActions = [
  { icon: HandCoins, label: 'Assistance\nloan' },
  { icon: ArrowLeftRight, label: 'Convert' },
  { icon: Download, label: 'Download', action: 'download' },
  { icon: Megaphone, label: 'Promotion\nCenter' },
  { icon: FileText, label: 'Delivery\ncontract', path: '/trade' },
  { icon: Calculator, label: 'Quant' },
  { icon: Users, label: 'Copy\nTrading' }
];

export default function Home() {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  // Temporary local values
  const [balance] = useState(1000);
  const [todayProfit] = useState(25.40);

  const [hideBalance, setHideBalance] = useState(false);

  const [topAssets, setTopAssets] = useState([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 63638,
      change: 2.35
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 1673.64,
      change: 1.87
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      price: 66.78,
      change: 3.21
    },
    {
      symbol: 'BNB',
      name: 'BNB',
      price: 605.07,
      change: -0.54
    }
  ]);

  useEffect(() => {
    const load = () =>
      fetchLivePrices(
        topAssets.map(a => a.symbol)
      ).then(data => {
        if (!Object.keys(data).length) return;

        setTopAssets(prev =>
          prev.map(a =>
            data[a.symbol]
              ? {
                  ...a,
                  price: data[a.symbol].price,
                  change: data[a.symbol].change
                }
              : a
          )
        );
      });

    load();

    const interval = setInterval(
      load,
      20000
    );

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">

      <div className="px-5 pt-6 pb-3 flex justify-between">

        <h1 className="text-2xl font-bold">
          SafeTradex
        </h1>

        <button
          onClick={() =>
            setProfileOpen(true)
          }
        >
          👤
        </button>

      </div>

     <div className="mx-5 mt-4 rounded-3xl bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-900 p-6 text-white shadow-2xl">

  <div className="flex items-center justify-between">

    <div>

      <p className="text-sm text-blue-100">
        Total Portfolio
      </p>

      <div className="flex items-center gap-2 mt-2">

        <h2 className="text-4xl font-bold">

          {hideBalance
            ? "••••••••"
            : `$${balance.toLocaleString()}`
          }

        </h2>

        <button
          onClick={() =>
            setHideBalance(!hideBalance)
          }
        >
          {hideBalance
            ? <EyeOff size={18}/>
            : <Eye size={18}/>
          }
        </button>

      </div>

    </div>

    <div className="text-right">

      <p className="text-xs text-blue-100">
        Today's P/L
      </p>

      <p className="text-2xl font-bold text-green-300">
        +${todayProfit}
      </p>

    </div>

  </div>

  <div className="grid grid-cols-3 gap-3 mt-6">

    <Button
      onClick={() => setDepositOpen(true)}
      className="rounded-xl"
    >
      Deposit
    </Button>

    <Button
      onClick={() => setWithdrawOpen(true)}
      variant="secondary"
      className="rounded-xl"
    >
      Withdraw
    </Button>

    <Button
      onClick={() => setConvertOpen(true)}
      variant="outline"
      className="rounded-xl"
    >
      Convert
    </Button>

  </div>

</div>
      </div>

      <LiveMarketStrip />

<div className="mx-5 mt-5">

  <h2 className="font-bold mb-4 text-lg">
    Quick Actions
  </h2>

  <div className="grid grid-cols-4 gap-4">

    {quickActions.map((item) => {

      const Icon = item.icon;

      return (

        <button
          key={item.label}
          onClick={() => {

            if (item.action === "download") {
              setDownloadOpen(true);
              return;
            }

            if (item.label.includes("Convert")) {
              setConvertOpen(true);
              return;
            }

            if (item.path) {
              navigate(item.path);
            }

          }}
          className="flex flex-col items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 p-4 hover:bg-slate-800 transition"
        >

          <div className="h-12 w-12 rounded-full bg-sky-500/20 flex items-center justify-center">

            <Icon
              size={22}
              className="text-sky-400"
            />

          </div>

          <span className="text-xs text-center mt-3 whitespace-pre-line">
            {item.label}
          </span>

        </button>

      );

    })}

  </div>

</div>
