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

      <div className="mx-5 bg-slate-900 rounded-xl p-5 text-white">

        <div className="flex gap-2">

          Account Balance

          <button
            onClick={() =>
              setHideBalance(
                !hideBalance
              )
            }
          >
            {hideBalance
              ? <EyeOff size={15}/>
              : <Eye size={15}/>
            }
          </button>

        </div>

        <h2 className="text-3xl mt-3">

          {hideBalance
            ? "******"
            : `$${balance}`
          }

        </h2>

        <p className="mt-2">
          Today Profit:
          {todayProfit}
        </p>

      </div>

      <LiveMarketStrip/>

      <div className="mx-5 mt-5">

        <h2 className="font-bold mb-3">
          Top Assets
        </h2>

        {topAssets.map(asset => (

          <div
            key={asset.symbol}
            className="flex justify-between py-2"
          >

            <div className="flex gap-3">

              <CoinLogo
                symbol={asset.symbol}
                size="sm"
              />

              <span>
                {asset.name}
              </span>

            </div>

            <span>

              ${asset.price}

            </span>

          </div>

        ))}

      </div>

      <ProfileDrawer
        open={profileOpen}
        onClose={() =>
          setProfileOpen(false)
        }
      />

      <DepositModal
        open={depositOpen}
        onClose={() =>
          setDepositOpen(false)
        }
      />

      <AddFundsModal
        open={addFundsOpen}
        onClose={() =>
          setAddFundsOpen(false)
        }
      />

      <DownloadModal
        open={downloadOpen}
        onClose={() =>
          setDownloadOpen(false)
        }
      />

      <WithdrawModal
        open={withdrawOpen}
        onClose={() =>
          setWithdrawOpen(false)
        }
      />

      <ConvertModal
        open={convertOpen}
        onClose={() =>
          setConvertOpen(false)
        }
      />

      <FloatingSupport />

    </div>
  );
}
