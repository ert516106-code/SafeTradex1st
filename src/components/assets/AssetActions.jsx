import {
  ArrowDown,
  ArrowUp,
  Repeat,
  Send,
} from "lucide-react";

const actions = [
  {
    title: "Deposit",
    icon: ArrowDown,
  },
  {
    title: "Withdraw",
    icon: ArrowUp,
  },
  {
    title: "Convert",
    icon: Repeat,
  },
  {
    title: "Transfer",
    icon: Send,
  },
];

export default function AssetActions() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 16,
        marginBottom: 30,
      }}
    >
      {actions.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.title}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#FFFFFF",
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                margin: "0 auto",
                borderRadius: "50%",
                background: "#1A2548",
                border: "1px solid #2D437A",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                size={24}
                color="#8EA2FF"
              />
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {item.title}
            </div>
          </button>
        );
      })}
    </div>
  );
}