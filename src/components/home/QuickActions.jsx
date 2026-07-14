import {
  CandlestickChart,
  ArrowLeftRight,
  Repeat,
  Clock3,
  Gift,
  Newspaper,
  Download,
  Headset,
  Wallet,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "Trade",
    icon: CandlestickChart,
    path: "/markets",
  },
  {
    title: "Convert",
    icon: ArrowLeftRight,
    path: "/convert",
  },
  {
    title: "Transfer",
    icon: Repeat,
    path: "/transfer/bitcoin",
  },
  {
    title: "Assets",
    icon: Wallet,
    path: "/assets",
  },
  {
    title: "History",
    icon: Clock3,
    path: "/history",
  },
  {
    title: "Rewards",
    icon: Gift,
    path: "/rewards",
  },
  {
    title: "Financial",
    icon: Newspaper,
    path: "/financial",
  },
  {
    title: "Download",
    icon: Download,
    path: "/download",
  },
  {
    title: "Assistance",
    icon: Headset,
    path: "/support",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        marginBottom: 28,
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(180deg,#09152F 0%,#0B1837 100%)",
          borderRadius: 24,
          padding: 20,
          border: "1px solid rgba(124,92,255,.65)",
          boxShadow: "0 0 18px rgba(124,92,255,.20)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            columnGap: 16,
            rowGap: 22,
          }}
        >
          {actions.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    margin: "0 auto",
                    borderRadius: 18,
                    background:
                      "linear-gradient(180deg,#2C2C73,#22245D)",
                    border:
                      "1px solid rgba(255,255,255,.06)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow:
                      "0 0 18px rgba(124,92,255,.35), inset 0 1px 2px rgba(255,255,255,.08)",
                  }}
                >
                  <Icon
                    size={24}
                    color="#FFFFFF"
                    strokeWidth={2}
                    style={{
                      filter:
                        "drop-shadow(0 0 8px #8B5CF6)",
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: 10,
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    textAlign: "center",
                    minHeight: 32,
                  }}
                >
                  {item.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}