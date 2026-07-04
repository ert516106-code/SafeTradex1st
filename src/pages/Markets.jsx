import { useState, useEffect } from 'react';
import { Search, ArrowLeft, CandlestickChart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CoinLogo from '../components/CoinLogo';
import { useNavigate } from 'react-router-dom';
import { fetchLivePrices } from '@/lib/livePrices';

const coins = [
  { symbol: 'BTC',  name: 'Bitcoin',       pair: 'BTC/USDT',  price: '$63,638.00', change: '+2.35%',  up: true  },
  { symbol: 'ETH',  name: 'Ethereum',      pair: 'ETH/USDT',  price: '$1,673.64',  change: '+1.87%',  up: true  },
  { symbol: 'XRP',  name: 'XRP',           pair: 'XRP/USDT',  price: '$0.5124',    change: '+0.92%',  up: true  },
  { symbol: 'LTC',  name: 'Litecoin',      pair: 'LTC/USDT',  price: '$82.30',     change: '-1.14%',  up: false },
  { symbol: 'BNB',  name: 'BNB',           pair: 'BNB/USDT',  price: '$605.07',    change: '-0.54%',  up: false },
  { symbol: 'SOL',  name: 'Solana',        pair: 'SOL/USDT',  price: '$66.78',     change: '+3.21%',  up: true  },
  { symbol: 'DOGE', name: 'Dogecoin',      pair: 'DOGE/USDT', price: '$0.1183',    change: '+4.52%',  up: true  },
  { symbol: 'TRX',  name: 'TRON',          pair: 'TRX/USDT',  price: '$0.1087',    change: '+1.03%',  up: true  },
  { symbol: 'ADA',  name: 'Cardano',       pair: 'ADA/USDT',  price: '$0.3942',    change: '-0.78%',  up: false },
  { symbol: 'AVAX', name: 'Avalanche',     pair: 'AVAX/USDT', price: '$28.14',     change: '+2.67%',  up: true  },
  { symbol: 'DOT',  name: 'Polkadot',      pair: 'DOT/USDT',  price: '$6.41',      change: '-1.23%',  up: false },
  { symbol: 'MATIC',name: 'Polygon',       pair: 'MATIC/USDT',price: '$0.5721',    change: '+1.45%',  up: true  },
  { symbol: 'LINK', name: 'Chainlink',     pair: 'LINK/USDT', price: '$13.28',     change: '+3.10%',  up: true  },
  { symbol: 'UNI',  name: 'Uniswap',       pair: 'UNI/USDT',  price: '$7.82',      change: '-0.44%',  up: false },
  { symbol: 'ATOM', name: 'Cosmos',        pair: 'ATOM/USDT', price: '$8.57',      change: '+0.65%',  up: true  },
  { symbol: 'XLM',  name: 'Stellar',       pair: 'XLM/USDT',  price: '$0.1042',    change: '+2.18%',  up: true  },
  { symbol: 'ETC',  name: 'Ethereum Classic', pair: 'ETC/USDT', price: '$25.63',  change: '-0.89%',  up: false },
  { symbol: 'FIL',  name: 'Filecoin',      pair: 'FIL/USDT',  price: '$4.21',      change: '+1.77%',  up: true  },
  { symbol: 'NEAR', name: 'NEAR Protocol', pair: 'NEAR/USDT', price: '$5.08',      change: '+2.94%',  up: true  },
  { symbol: 'APT',  name: 'Aptos',         pair: 'APT/USDT',  price: '$7.34',      change: '-1.56%',  up: false },
];

export default function Markets() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [prices, setPrices] = useState({});

  useEffect(() => {
    let active = true;
    const load = () => fetchLivePrices(coins.map(c => c.symbol)).then(data => { if (active) setPrices(data); });
    load();
    const interval = setInterval(load, 20000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const filtered = coins.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.symbol.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background font-inter pb-24">
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Markets</h1>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search trading pair"
            className="pl-10 h-11 rounded-xl bg-secondary border-0"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between border-b border-border mb-2">
          <div className="flex gap-4">
            <button className="pb-2 border-b-2 border-primary text-sm font-semibold text-foreground">Crypto</button>
          </div>
          <button onClick={() => navigate('/coins')} className="text-xs font-semibold text-primary pb-2">All Coins</button>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground py-2 px-1">
          <span>Name</span>
          <span>Latest price</span>
          <span>Fluctuation</span>
        </div>
      </div>

      <div className="px-5">
        {filtered.map(coin => {
          const live = prices[coin.symbol];
          const priceLabel = live ? (live.price < 1 ? `$${live.price.toFixed(4)}` : `$${live.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`) : coin.price;
          const changeLabel = live ? `${live.change >= 0 ? '+' : ''}${live.change.toFixed(2)}%` : coin.change;
          const up = live ? live.change >= 0 : coin.up;
          return (
            <div key={coin.symbol} className="flex items-center py-3 border-b border-border last:border-0">
              <CoinLogo symbol={coin.symbol} size="sm" />
              <div className="ml-3 flex-1 min-w-0">
                <p className="font-semibold text-sm">{coin.name}</p>
                <p className="text-xs text-muted-foreground">{coin.pair}</p>
              </div>
              <div className="text-right min-w-[90px]">
                <p className="font-semibold text-sm">{priceLabel}</p>
              </div>
              <div className="text-right min-w-[72px]">
                <p className={`text-xs font-medium ${up ? 'text-emerald-500' : 'text-red-500'}`}>{changeLabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-1.5 py-6 text-muted-foreground">
        <CandlestickChart className="w-4 h-4" />
        <span className="text-xs font-medium">Charts powered by TradingView</span>
      </div>
    </div>
  );
}
