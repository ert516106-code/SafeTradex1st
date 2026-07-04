import { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import CoinLogo from '../components/CoinLogo';
import { fetchLivePrices } from '@/lib/livePrices';

const coinList = [
  { symbol: 'BTC',  name: 'Bitcoin',            fallback: 63638.00 },
  { symbol: 'ETH',  name: 'Ethereum',           fallback: 1673.64 },
  { symbol: 'XRP',  name: 'XRP',                fallback: 0.5124 },
  { symbol: 'LTC',  name: 'Litecoin',           fallback: 82.30 },
  { symbol: 'BNB',  name: 'BNB',                fallback: 605.07 },
  { symbol: 'SOL',  name: 'Solana',             fallback: 66.78 },
  { symbol: 'DOGE', name: 'Dogecoin',           fallback: 0.1183 },
  { symbol: 'TRX',  name: 'TRON',               fallback: 0.1087 },
  { symbol: 'ADA',  name: 'Cardano',            fallback: 0.3942 },
  { symbol: 'AVAX', name: 'Avalanche',          fallback: 28.14 },
  { symbol: 'DOT',  name: 'Polkadot',           fallback: 6.41 },
  { symbol: 'MATIC',name: 'Polygon',            fallback: 0.5721 },
  { symbol: 'LINK', name: 'Chainlink',          fallback: 13.28 },
  { symbol: 'UNI',  name: 'Uniswap',            fallback: 7.82 },
  { symbol: 'ATOM', name: 'Cosmos',             fallback: 8.57 },
  { symbol: 'XLM',  name: 'Stellar',            fallback: 0.1042 },
  { symbol: 'ETC',  name: 'Ethereum Classic',   fallback: 25.63 },
  { symbol: 'FIL',  name: 'Filecoin',           fallback: 4.21 },
  { symbol: 'NEAR', name: 'NEAR Protocol',      fallback: 5.08 },
  { symbol: 'APT',  name: 'Aptos',              fallback: 7.34 },
];

export default function Coins() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [prices, setPrices] = useState({});

  useEffect(() => {
    let active = true;
    const load = () => fetchLivePrices(coinList.map(c => c.symbol)).then(data => { if (active) setPrices(data); });
    load();
    const interval = setInterval(load, 20000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const filtered = coinList.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.symbol.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background font-inter pb-24">
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/markets')} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">All Coins</h1>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search coin"
            className="pl-10 h-11 rounded-xl bg-secondary border-0"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground py-2 px-1">
          <span>Name</span>
          <span>Price</span>
          <span>24h</span>
        </div>
      </div>

      <div className="px-5">
        {filtered.map(coin => {
          const live = prices[coin.symbol];
          const price = live?.price ?? coin.fallback;
          const change = live?.change ?? 0;
          const up = change >= 0;
          return (
            <div key={coin.symbol} className="flex items-center py-3 border-b border-border last:border-0">
              <CoinLogo symbol={coin.symbol} size="sm" />
              <div className="ml-3 flex-1 min-w-0">
                <p className="font-semibold text-sm">{coin.name}</p>
                <p className="text-xs text-muted-foreground">{coin.symbol}</p>
              </div>
              <div className="text-right min-w-[90px]">
                <p className="font-semibold text-sm">{price < 1 ? `$${price.toFixed(4)}` : `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}</p>
              </div>
              <div className="text-right min-w-[72px]">
                <p className={`text-xs font-medium ${up ? 'text-emerald-500' : 'text-red-500'}`}>{up ? '+' : ''}{change.toFixed(2)}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
