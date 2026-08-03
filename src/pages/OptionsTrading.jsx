import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TradingViewWidget from "../components/trading/TradingViewWidget";
import TradingModal from "../components/trading/TradingModal";
import OpenOrders from "../components/trading/Openorders";
import OrderHistory from "../components/trading/Orderhistory";

const pairs = [
  { symbol: "BTC/USDT", tv: "BINANCE:BTCUSDT", coinId: "bitcoin", ticker: "BTC" },
  { symbol: "ETH/USDT", tv: "BINANCE:ETHUSDT", coinId: "ethereum", ticker: "ETH" },
  { symbol: "XRP/USDT", tv: "BINANCE:XRPUSDT", coinId: "ripple", ticker: "XRP" },
  { symbol: "SOL/USDT", tv: "BINANCE:SOLUSDT", coinId: "solana", ticker: "SOL" },
  { symbol: "BNB/USDT", tv: "BINANCE:BNBUSDT", coinId: "binancecoin", ticker: "BNB" },
  { symbol: "DOGE/USDT", tv: "BINANCE:DOGEUSDT", coinId: "dogecoin", ticker: "DOGE" },
];

const timeframes = ["1m", "5m", "15m", "30m", "1h", "2h", "6h", "12h", "1D"];
const indicators = ["MA", "EMA", "BOLL", "MACD", "RSI", "WR"];

export default function OptionsTrading({ onBack }) {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(pairs[0]);
  const [modal, setModal] = useState({ open: false, type: "long" });
  const [showPairs, setShowPairs] = useState(false);
  const [activeTab, setActiveTab] = useState("open");
  const [activeTimeframe, setActiveTimeframe] = useState("1m");
  const [activeIndicator, setActiveIndicator] = useState("MA");
  const [balance, setBalance] = useState(10000);

  const [marketData, setMarketData] = useState({
    price: 0,
    change24h: 0,
    high24h: 0,
    low24h: 0,
    volume24h: 0,
    loading: true,
  });

  const fetchCoinGeckoData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${selected.coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
      );

      if (!response.ok) {
        throw new Error("Market data unavailable");
      }

      const data = await response.json();

      if (data?.market_data) {
        setMarketData({
          price: data.market_data.current_price.usd ?? 0,
          change24h: data.market_data.price_change_percentage_24h ?? 0,
          high24h: data.market_data.high_24h.usd ?? 0,
          low24h: data.market_data.low_24h.usd ?? 0,
          volume24h: data.market_data.total_volume.usd ?? 0,
          loading: false,
        });
      }
    } catch (error) {
      console.warn("Could not load market data:", error);
    }
  }, [selected.coinId]);

  useEffect(() => {
    setMarketData((previous) => ({ ...previous, loading: true }));
    fetchCoinGeckoData();

    const interval = setInterval(fetchCoinGeckoData, 60000);
    return () => clearInterval(interval);
  }, [fetchCoinGeckoData]);

  const orderList = useMemo(
    () => (activeTab === "open" ? <OpenOrders /> : <OrderHistory />),
    [activeTab]
  );

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate(-1);
  };

  const handleSelectPair = (pair) => {
    setSelected(pair);
    setShowPairs(false);
  };

  const priceLabel = marketData.loading
    ? "---"
    : `$${marketData.price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

  return (
    <div className="min-h-screen bg-[#050816] px-3 py-3 pb-8 font-sans text-slate-100">
      <main className="relative mx-auto w-full max-w-[520px]">
        <div className="rounded-[24px] border border-[#253553] bg-[#081126]/95 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.38)]">
          <header className="relative flex items-center justify-between pb-3">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Back"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition active:scale-90"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 5l-7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setShowPairs((visible) => !visible)}
              className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-white/[0.05]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f7931a] text-xs font-black text-[#17110a]">
                ₿
              </span>
              <span className="text-[17px] font-extrabold text-white">
                {selected.symbol}
              </span>
              <ChevronDown size={16} className="text-slate-400" />
            </button>

            <div className="h-10 w-10" />
          </header>

          {showPairs && (
            <div className="absolute left-3 right-3 top-14 z-50 rounded-2xl border border-white/10 bg-[#10182e]/95 p-2 shadow-2xl backdrop-blur-xl">
              {pairs.map((pair) => (
                <button
                  key={pair.symbol}
                  type="button"
                  onClick={() => handleSelectPair(pair)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                    selected.symbol === pair.symbol
                      ? "bg-[#2f5fe8]/20 text-blue-300"
                      : "text-slate-300 hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{pair.symbol}</span>
                  <span className="text-xs font-medium text-slate-500">
                    {pair.ticker}
                  </span>
                </button>
              ))}
            </div>
          )}

          <section className="mb-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[34px] font-black leading-none tracking-tight text-white sm:text-[38px]">
                  {priceLabel}
                </div>

                <div
                  className={`mt-1.5 text-[13px] font-bold ${
                    marketData.change24h >= 0
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {marketData.change24h >= 0 ? "+" : ""}
                  {marketData.change24h.toFixed(2)}%
                  <span className="ml-1 font-medium text-slate-500">24H</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-x-3 text-right text-[10px] font-semibold">
                <div>
                  <span className="block text-slate-500">High</span>
                  <span className="text-emerald-400">
                    ${marketData.high24h.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="block text-slate-500">Low</span>
                  <span className="text-rose-400">
                    ${marketData.low24h.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="block text-slate-500">Vol</span>
                  <span className="text-slate-200">
                    ${(marketData.volume24h / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="mb-2 flex gap-1 overflow-x-auto rounded-xl border border-white/[0.06] bg-black/10 p-1 no-scrollbar">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe}
                type="button"
                onClick={() => setActiveTimeframe(timeframe)}
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[12px] font-bold transition ${
                  activeTimeframe === timeframe
                    ? "bg-[#3848e8] text-white shadow-[0_3px_12px_rgba(56,72,232,0.4)]"
                    : "text-slate-500 hover:text-slate-200"
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>

          <div
            className="mt-3 overflow-hidden rounded-2xl border border-[#243451] bg-[#0a1222] shadow-[0_10px_26px_rgba(0,0,0,0.2)]"
            style={{ height: 280 }}
          >
            <TradingViewWidget
              symbol={selected.tv}
              height={280}
              interval={activeTimeframe}
              theme="dark"
            />
          </div>

          <div className="mt-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {indicators.map((indicator) => (
              <button
                key={indicator}
                type="button"
                onClick={() => setActiveIndicator(indicator)}
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition ${
                  activeIndicator === indicator
                    ? "bg-[#2f5fe8]/20 text-blue-300"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
                }`}
              >
                {indicator}
              </button>
            ))}
          </div>

          <section className="mt-3 overflow-hidden rounded-2xl border border-[#243451] bg-[#0a1222]">
            <div className="flex gap-6 border-b border-white/[0.07] px-4 pt-3">
              <button
                type="button"
                onClick={() => setActiveTab("open")}
                className={`border-b-2 pb-3 text-[13px] font-bold transition ${
                  activeTab === "open"
                    ? "border-[#4b5cf4] text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                Open Orders
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`border-b-2 pb-3 text-[13px] font-bold transition ${
                  activeTab === "history"
                    ? "border-[#4b5cf4] text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                Order History
              </button>
            </div>

            <div className="min-h-[145px] p-3">{orderList}</div>
          </section>

          <div className="mt-3 grid grid-cols-2 gap-3 pb-1">
            <button
              type="button"
              onClick={() => setModal({ open: true, type: "long" })}
              className="rounded-2xl bg-gradient-to-r from-[#10c6a4] to-[#08a98d] py-4 text-white shadow-[0_10px_22px_rgba(8,169,141,0.28)] transition active:scale-[0.98]"
            >
              <span className="block text-[15px] font-black">Buy Long</span>
              <span className="mt-0.5 block text-[12px] font-bold opacity-90">
                {marketData.loading ? "---" : `$${marketData.price.toFixed(2)}`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setModal({ open: true, type: "short" })}
              className="rounded-2xl bg-gradient-to-r from-[#ff3d70] to-[#fa1f59] py-4 text-white shadow-[0_10px_22px_rgba(250,31,89,0.28)] transition active:scale-[0.98]"
            >
              <span className="block text-[15px] font-black">Sell Short</span>
              <span className="mt-0.5 block text-[12px] font-bold opacity-90">
                {marketData.loading ? "---" : `$${marketData.price.toFixed(2)}`}
              </span>
            </button>
          </div>
        </div>
      </main>

      <TradingModal
        open={modal.open}
        type={modal.type}
        coin={selected.ticker}
        balance={balance}
        currentPrice={marketData.price}
        onClose={() => setModal({ open: false, type: "long" })}
        onBalanceChange={setBalance}
      />
    </div>
  );
}
