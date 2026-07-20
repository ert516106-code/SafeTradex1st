import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

const TRADINGVIEW_TIMELINE_SRC =
  "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";

export default function NewsList() {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";
    setStatus("loading");

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    containerRef.current.appendChild(widgetContainer);

    const script = document.createElement("script");
    script.src = TRADINGVIEW_TIMELINE_SRC;
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: "symbol",
      symbol: "BITSTAMP:BTCUSD",
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "regular",
      width: "100%",
      height: 480,
      locale: "en",
    });

    const failTimer = setTimeout(() => {
      setStatus((prev) => (prev === "loading" ? "error" : prev));
    }, 8000);

    script.onload = () => {
      clearTimeout(failTimer);
      setStatus("ready");
    };
    script.onerror = () => {
      clearTimeout(failTimer);
      setStatus("error");
    };

    containerRef.current.appendChild(script);

    return () => {
      clearTimeout(failTimer);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      {status === "loading" && (
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm py-10">
          <RefreshCw size={16} className="animate-spin" />
          Loading TradingView news...
        </div>
      )}

      {status === "error" && (
        <div className="text-center py-10 px-6">
          <p className="text-slate-400 text-sm leading-relaxed">
            Couldn't load TradingView news right now. It will retry on next visit.
          </p>
        </div>
      )}

      <div
        ref={containerRef}
        className="tradingview-widget-container"
        style={{ display: status === "ready" ? "block" : "none" }}
      />
    </div>
  );
}
