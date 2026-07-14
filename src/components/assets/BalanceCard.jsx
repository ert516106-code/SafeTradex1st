import { Eye, RefreshCw } from "lucide-react";

export default function BalanceCard() {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg,#1E3170 0%,#274DB8 100%)",
        borderRadius: 24,
        padding: 24,
        color: "#FFFFFF",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          color: "#C8D6FF",
          fontSize: 15,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        Account Balance (USDT)

        <Eye size={17} />

        <RefreshCw
          size={17}
          style={{
            cursor: "pointer",
          }}
        />
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 44,
          fontWeight: 700,
        }}
      >
        $0.00
      </div>

      <div
        style={{
          marginTop: 8,
          color: "#00F593",
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        Today's Profit +0.00
      </div>
    </div>
  );
}