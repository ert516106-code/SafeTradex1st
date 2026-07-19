import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, Repeat, Send } from "lucide-react";

const ACTIONS = [
  { key: "deposit", label: "Deposit", icon: ArrowDown, path: "/deposit" },
  { key: "withdraw", label: "Withdraw", icon: ArrowUp, path: "/withdraw" },
  { key: "convert", label: "Convert", icon: Repeat, path: "/convert" },
  { key: "transfer", label: "Transfer", icon: Send, path: "/transfer" },
];

export default function AssetActions() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        marginBottom: 28,
      }}
    >
      {ACTIONS.map(({ key, label, icon: Icon, path }) => (
        <button
          key={key}
          onClick={() => navigate(path)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(129,140,248,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={22} color="#818CF8" />
          </span>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: "#fff" }}>{label}</span>
        </button>
      ))}
    </div>
  );
}
