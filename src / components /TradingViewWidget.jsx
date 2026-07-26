import { useEffect, useRef } from 'react';

const INTERVAL_MAP = {
  '1m': '1', '2m': '3', '3m': '5', '5m': '5',
  '15m': '15', '30m': '30', '1h': '60', '2h': '120', '6h': '240',
};

export default function TradingViewWidget({ symbol = 'BINANCE:BTCUSDT', height = 400, interval = '15m', chartStyle = '1' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: INTERVAL_MAP[interval] || '15',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: chartStyle, // '1' = candles, '3' = area
      locale: 'en',
      allow_symbol_change: false,
      hide_top_toolbar: true,
      hide_legend: true,
      save_image: false,
      calendar: false,
      support_host: 'https://www.tradingview.com',
    });
    containerRef.current.appendChild(script);
  }, [symbol, interval, chartStyle]);

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height, width: '100%' }}>
      <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
