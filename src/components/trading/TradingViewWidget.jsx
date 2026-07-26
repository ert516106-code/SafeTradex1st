import { useEffect, useRef } from 'react';

const INTERVAL_MAP = {
  '1m': '1',
  '2m': '3',
  '3m': '5',
  '5m': '5',
  '15m': '15',
  '30m': '30',
  '1h': '60',
  '2h': '120',
  '6h': '240',
};

// TradingView's dark theme background — used to prevent white flash
// while the iframe is loading/reloading.
const DARK_BG = '#131722';

export default function TradingViewWidget({
  symbol = 'BINANCE:BTCUSDT',
  height = 400,
  interval = '15m',
  chartStyle = '1',
}) {
  const containerRef = useRef(null);
  const widgetDivRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    const widgetDiv = widgetDivRef.current;
    const container = containerRef.current;
    if (!widgetDiv || !container) return;

    // Clear only the inner widget div (not the whole container),
    // so we never destroy/recreate the outer wrapper — this avoids
    // layout flicker and keeps the copyright/branding row stable.
    widgetDiv.innerHTML = '';

    // Remove any previous script instance before creating a new one,
    // guarding against duplicate script injection.
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
      scriptRef.current = null;
    }

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
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
      backgroundColor: DARK_BG,
      gridColor: 'rgba(255, 255, 255, 0.06)',
      allow_symbol_change: false,
      hide_top_toolbar: true,
      hide_legend: true,
      hide_side_toolbar: true,
      withdateranges: false,
      save_image: false,
      calendar: false,
      hotlist: false,
      details: false,
      studies: [],
      support_host: 'https://www.tradingview.com',
    });

    scriptRef.current = script;
    widgetDiv.appendChild(script);

    // Cleanup on unmount / before re-running effect: remove the script
    // and clear the injected iframe so nothing leaks between mounts.
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      scriptRef.current = null;
      if (widgetDiv) {
        widgetDiv.innerHTML = '';
      }
    };
  }, [symbol, interval, chartStyle]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container relative w-full overflow-hidden rounded-xl"
      style={{ height, width: '100%', backgroundColor: DARK_BG }}
    >
      <div
        ref={widgetDivRef}
        className="tradingview-widget-container__widget"
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}
