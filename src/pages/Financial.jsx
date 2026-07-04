import { Wallet, TrendingUp, Shield, Gift, ArrowLeft } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const products = [
  { icon: Wallet, title: 'Flexible Savings', desc: 'Earn interest on your idle assets', rate: '5.2% APY' },
  { icon: TrendingUp, title: 'Fixed Deposit', desc: 'Lock assets for higher returns', rate: '12.8% APY' },
  { icon: Shield, title: 'Insurance Fund', desc: 'Protect your investments', rate: 'From $10' },
  { icon: Gift, title: 'Rewards Hub', desc: 'Complete tasks and earn rewards', rate: 'Up to $500' },
];

function CryptoNewsWidget() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: 'market',
      market: 'crypto',
      isTransparent: false,
      displayMode: 'regular',
      width: '100%',
      height: 400,
      colorTheme: 'light',
      locale: 'en',
    });
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default function Financial() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background font-inter pb-24">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/')} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Financial Services</h1>
        </div>
        <p className="text-sm text-muted-foreground">Grow your portfolio with our products</p>
      </div>

      <div className="px-5 space-y-3 mb-6">
        {products.map(({ icon: Icon, title, desc, rate }) => (
          <div key={title} className="bg-card border rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <span className="text-xs font-bold text-emerald-500 whitespace-nowrap">{rate}</span>
          </div>
        ))}
      </div>

      <div className="px-5">
        <h2 className="text-base font-bold mb-3">Crypto News</h2>
        <div className="rounded-2xl overflow-hidden border border-border">
          <CryptoNewsWidget />
        </div>
      </div>
    </div>
  );
}
