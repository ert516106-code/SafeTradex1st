import { useState, useEffect, useRef } from 'react';

// TradingView's real-time WebSocket feed (same source as their charts)
// Symbol format: "BINANCE:BTCUSDT"
export function useTradingViewPrice(symbol) {
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  useEffect(() => {
    if (!symbol) return;

    let cancelled = false;

    function connect() {
      // TradingView uses a public WebSocket for quote streaming
      const ws = new WebSocket('wss://data.tradingview.com/socket.io/websocket', 'echo-protocol');
      wsRef.current = ws;

      ws.onopen = () => {
        // Generate a session ID
        const session = `qs_${Math.random().toString(36).substring(2, 10)}`;
        
        // 1. Set the auth token (public)
        ws.send(`~m~${JSON.stringify({ m: 'set_auth_token', p: ['unauthorized_user_token'] }).length}~m~${JSON.stringify({ m: 'set_auth_token', p: ['unauthorized_user_token'] })}`);
        
        // 2. Create a quote session
        ws.send(`~m~${JSON.stringify({ m: 'quote_create_session', p: [session] }).length}~m~${JSON.stringify({ m: 'quote_create_session', p: [session] })}`);
        
        // 3. Subscribe to the symbol
        const subMsg = { m: 'quote_add_symbols', p: [session, symbol, { flags: ['force_permission'] }] };
        ws.send(`~m~${JSON.stringify(subMsg).length}~m~${JSON.stringify(subMsg)}`);
        
        // 4. Request a fast update
        const fastMsg = { m: 'quote_fast_symbols', p: [session, symbol] };
        ws.send(`~m~${JSON.stringify(fastMsg).length}~m~${JSON.stringify(fastMsg)}`);
      };

      ws.onmessage = (event) => {
        if (cancelled) return;
        
        // TradingView uses a custom protocol: ~m~<length>~m~<json>
        const data = event.data;
        const parts = data.split('~m~');
        
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (!part) continue;
          
          // Skip the length markers (pure numbers)
          if (/^\d+$/.test(part)) continue;
          
          try {
            const msg = JSON.parse(part);
            
            // The quote data comes in 'qsd' messages
            if (msg.m === 'qsd' && msg.p && msg.p[1]) {
              const quote = msg.p[1];
              // The 'lp' field is the last price
              if (quote.v && quote.v.lp) {
                const newPrice = parseFloat(quote.v.lp);
                if (newPrice > 0 && !cancelled) {
                  setPrice(newPrice);
                  setLoading(false);
                }
              }
            }
          } catch (e) {
            // Ignore parse errors from heartbeat messages
          }
        }
      };

      ws.onerror = (err) => {
        console.warn('TradingView WS error:', err);
      };

      ws.onclose = () => {
        if (!cancelled) {
          // Reconnect after 2 seconds
          reconnectRef.current = setTimeout(connect, 2000);
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [symbol]);

  return { price, loading };
}
