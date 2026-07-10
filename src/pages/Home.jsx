import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import HomeHeader from "../components/HomeHeader";
import HomeBalanceCard from "../components/HomeBalanceCard";
import HomeQuickActions from "../components/HomeQuickActions";
import HomeTopAssets from "../components/HomeTopAssets";
import HomeNews from "../components/HomeNews";
import HomeRecentTransactions from "../components/HomeRecentTransactions";

import LiveMarketStrip from "../components/LiveMarketStrip";
import FloatingSupport from "../components/FloatingSupport";

import ProfileDrawer from "../components/ProfileDrawer";
import DownloadModal from "../components/DownloadModal";
import DepositModal from "../components/DepositModal";
import WithdrawModal from "../components/WithdrawModal";
import ConvertModal from "../components/ConvertModal";

import { fetchLivePrices } from "../lib/livePrices";

export default function Home() {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  const [hideBalance, setHideBalance] = useState(false);

  const [balance] = useState(1000);
  const [todayProfit] = useState(25.4);

  const [topAssets, setTopAssets] = useState([
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 0,
      change: 0,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 0,
      change: 0,
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: 0,
      change: 0,
    },
    {
      symbol: "BNB",
      name: "BNB",
      price: 0,
      change: 0,
    },
  ]);

  const [news] = useState([
    {
      id: 1,
      title: "Welcome to SafeTradex",
      description: "Trade digital assets securely.",
    },
    {
      id: 2,
      title: "Install SafeTradex",
      description: "Use the Install App button from Quick Actions.",
    },
    {
      id: 3,
      title: "More features coming soon",
      description: "Staking, Copy Trading and Loans.",
    },
  ]);

  const [transactions] = useState([
    {
      id: 1,
      type: "Deposit",
      asset: "USDT",
      amount: "+500.00",
      time: "Today",
    },
    {
      id: 2,
      type: "Trade",
      asset: "BTC",
      amount: "-0.0021",
      time: "Today",
    },
    {
      id: 3,
      type: "Withdrawal",
      asset: "USDT",
      amount: "-100.00",
      time: "Yesterday",
    },
  ]);

  useEffect(() => {
    const loadPrices = async () => {
      const prices = await fetchLivePrices(
        topAssets.map((coin) => coin.symbol)
      );

      if (!Object.keys(prices).length) return;

      setTopAssets((prev) =>
        prev.map((coin) =>
          prices[coin.symbol]
            ? {
                ...coin,
                price: prices[coin.symbol].price,
                change: prices[coin.symbol].change,
              }
            : coin
        )
      );
    };

    loadPrices();

    const interval = setInterval(loadPrices, 20000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <DashboardLayout
      header={
        <HomeHeader
          onProfile={() => setProfileOpen(true)}
        />
      }
    >

      <HomeBalanceCard
        balance={balance}
        todayProfit={todayProfit}
        hideBalance={hideBalance}
        setHideBalance={setHideBalance}
        onDeposit={() => setDepositOpen(true)}
        onWithdraw={() => setWithdrawOpen(true)}
        onConvert={() => setConvertOpen(true)}
      />

      <LiveMarketStrip />

      <HomeQuickActions
        navigate={navigate}
        onDeposit={() => setDepositOpen(true)}
        onWithdraw={() => setWithdrawOpen(true)}
        onConvert={() => setConvertOpen(true)}
        onDownload={() => setDownloadOpen(true)}
      />

      <HomeTopAssets
        assets={topAssets}
        navigate={navigate}
      />

      <HomeRecentTransactions
        transactions={transactions}
      />

      <HomeNews
        news={news}
      />
