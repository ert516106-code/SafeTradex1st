import { useEffect, useRef, useState } from "react";
import {
  Wallet,
  TrendingUp,
  Shield,
  Gift,
  Newspaper,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

import FinancialCard from "../components/financial/FinancialCard";
import BottomNavigation from "../components/layout/BottomNavigation";
import { getCryptoNews } from "../services/newsService";

const REFRESH_INTERVAL_MS = 12 * 60 * 60 * 1000;

function timeAgo(isoOrUnix) {
  const ms =
    typeof isoOrUnix === "number" ? isoOrUnix * 1000 : new Date(isoOrUnix).getTime();
  const diffMs = Date.now() - ms;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function CryptoNewsFeed() {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState("loading");
  const [lastFetched, setLastFetched] = useState(null);
  const intervalRef = useRef(null);

  const fetchNews = async () => {
    setStatus((prev) => (prev === "loading" ? "loading" : "refreshing"));
    const data = await getCryptoNews();
    setArticles(Array.isArray(data) ? data.slice(0, 6) : []);
    setLastFetched(Date.now());
    setStatus("ready");
  };

  useEffect(() => {
    fetchNews();
    intervalRef.current = setInterval(fetchNews, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      style={{
        borderRadius: 20,
        border: "1px solid #23304c",
        background: "linear-gradient(180deg,#111c3d 0%,#0c1530 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 18px",
          borderBottom: "1px solid #1f2c4d",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22C55E",
              boxShadow: "0 0 8px rgba(34,197,94,0.8)",
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>
            Top Stories
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "#64748B",
          }}
        >
          <RefreshCw
            size={12}
            style={{
              animation: status === "refreshing" ? "spin 1s linear infinite" : "none",
            }}
          />
          {lastFetched
            ? `Updated ${timeAgo(Math.floor(lastFetched / 1000))}`
            : "Loading..."}
        </div>
      </div>

      {status === "loading" && (
        <div style={{ padding: 26, textAlign: "center", color: "#64748B", fontSize: 13 }}>
          Fetching the latest headlines...
        </div>
      )}

      {status !== "loading" && articles.length === 0 && (
        <div style={{ padding: 26, textAlign: "center", color: "#64748B", fontSize: 13 }}>
          No news available right now.
        </div>
      )}

      {status !== "loading" &&
        articles.map((item, idx) => {
          const itemKey = item.id ? item.id : item.url ? item.url : idx;
          const isLast = idx === articles.length - 1;

          return (
            
              key={itemKey}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                gap: 12,
                padding: "14px 18px",
                textDecoration: "none",
                borderBottom: isLast ? "none" : "1px solid #1a2540",
                transition: "background 0.15s ease",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "rgba(59,130,246,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Newspaper size={16} color="#60A5FA" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#F1F5F9",
                    lineHeight: 1.4,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    marginTop: 5,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11.5,
                    color: "#64748B",
                  }}
                >
                  <span>{item.source || "Crypto News"}</span>
                  <span>·</span>
                  <span>{timeAgo(item.publishedAt)}</span>
                </div>
              </div>

              <ExternalLink size={14} color="#475569" style={{ flexShrink: 0, marginTop: 2 }} />
            </a>
          );
        })}

      <div
        style={{
          padding: "10px 18px",
          fontSize: 10.5,
          color: "#475569",
          textAlign: "center",
        }}
      >
        Headlines refresh automatically every 12 hours
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function Financial() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#18254b 0%,#050816 70%)",
        color: "#FFFFFF",
        padding: 20,
        paddingBottom: 100,
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 30,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            Financial Services
          </div>

          <div
            style={{
              color: "#94A3B8",
              marginTop: 5,
            }}
          >
            Grow your portfolio with our products
          </div>
        </div>
      </div>

      {/* Products */}

      <FinancialCard
        icon={<Wallet size={28} />}
        title="Flexible Savings"
        subtitle="Earn interest on your idle assets"
        value="5.20% APY"
        color="#22C55E"
      />

      <FinancialCard
        icon={<TrendingUp size={28} />}
        title="Fixed Deposit"
        subtitle="Lock assets for higher returns"
        value="12.80% APY"
        color="#22C55E"
      />

      <FinancialCard
        icon={<Shield size={28} />}
        title="Insurance Fund"
        subtitle="Protect your investments"
        value="From $10"
        color="#22C55E"
      />

      <FinancialCard
        icon={<Gift size={28} />}
        title="Rewards Hub"
        subtitle="Complete tasks and earn rewards"
        value="Up to $500"
        color="#22C55E"
      />

      {/* News */}

      <div
        style={{
          marginTop: 40,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Crypto News
        </div>

        <div
          style={{
            color: "#94A3B8",
          }}
        >
          Live headlines, refreshed every 12 hours
        </div>
      </div>

      <CryptoNewsFeed />

      <BottomNavigation />
    </div>
  );
}
