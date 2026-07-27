import { useState, useEffect, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const PERIODS = [
  { label: '1H', points: 60, volatility: 0.0006 },
  { label: '4H', points: 48, volatility: 0.0012 },
  { label: '1D', points: 96, volatility: 0.002 },
  { label: '1W', points: 84, volatility: 0.006 },
  { label: '1M', points: 90, volatility: 0.015 },
];

// --- DEMO DATA ONLY ---
// Replace this function with a call to a real price-history endpoint
// (e.g. services/chartService.getCoinChart(coinId, period)) when one is available.
// It exists only so the chart has something to render during development.
function generateDemoSeries(basePrice, config) {
  const { points, volatility } = config;
  const series = [];
  let price = basePrice * (1 - volatility * (points / 20));
  for (let i = 0; i < points; i++) {
    const drift = (Math.random() - 0.48) * volatility;
    price = Math.max(price * (1 + drift), 0.01);
    series.push({ i, price: +price.toFixed(2) });
  }
  // anchor the final point to the real current price so the chart lines up with the header
  series[series.length - 1] = { i: points - 1, price: basePrice };
  return series;
}

function ChartSkeleton() {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        borderRadius: 12,
        background:
          'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%)',
        backgroundSize: '400% 100%',
        animation: 'safetrade-shimmer 1.4s ease infinite',
      }}
    />
  );
}

export default function TradingChart({ coin }) {
  const [period, setPeriod] = useState(PERIODS[2]); // default 1D
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setData(generateDemoSeries(coin?.price || 100, period));
      setLoading(false);
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period.label, coin?.symbol]);

  const isUp = useMemo(() => {
    if (data.length < 2) return true;
    return data[data.length - 1].price >= data[0].price;
  }, [data]);

  const lineColor = isUp ? '#10b981' : '#ef4444';

  const openTradingView = () => {
    const symbol = coin?.symbol || 'BTC';
    window.open(`https://www.tradingview.com/symbols/${symbol}USDT/`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ padding: '12px 16px 0' }}>
      <style>{`
        @keyframes safetrade-shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {PERIODS.map((p) => (
            <button
              key={p.label}
              onClick={() => setPeriod(p)}
              style={{
                border: 'none',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: period.label === p.label ? '#111827' : '#f3f4f6',
                color: period.label === p.label ? '#fff' : '#6b7280',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={openTradingView}
          aria-label="Open in TradingView"
          title="Open in TradingView"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            border: 'none',
            background: '#f3f4f6',
            borderRadius: 8,
            padding: '5px 8px',
            fontSize: 11,
            fontWeight: 600,
            color: '#6b7280',
            cursor: 'pointer',
          }}
        >
          <ExternalLink style={{ width: 12, height: 12 }} />
          TradingView
        </button>
      </div>

      <div style={{ position: 'relative', height: 180, width: '100%' }}>
        {loading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="tradingChartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="i" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip
                formatter={(value) => [`${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'Price']}
                labelFormatter={() => ''}
                contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e5e7eb' }}
              />
              <Area type="monotone" dataKey="price" stroke={lineColor} strokeWidth={2} fill="url(#tradingChartFill)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <p style={{ fontSize: 10, color: '#d1d5db', textAlign: 'right', margin: '2px 0 8px' }}>
        Demo chart data for development
      </p>
    </div>
  );
}
