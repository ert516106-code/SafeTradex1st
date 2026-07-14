import { ArrowLeft, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMarket } from "../contexts/MarketContext";
import { useState } from "react";

export default function Transfer() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { coins } = useMarket();

  const coin = coins.find((c) => c.id === id);

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  if (!coin) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#1E3170 0%,#08111F 70%)",
        color: "#fff",
        padding: 20,
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 28,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            border: "1px solid #2A3F73",
            background: "#101933",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Transfer {coin.name}
          </div>

          <div
            style={{
              color: "#8EA2D8",
            }}
          >
            {coin.symbol} Network
          </div>
        </div>
      </div>

      {/* Wallet Address */}

      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            marginBottom: 10,
            color: "#8EA2D8",
            fontSize: 14,
          }}
        >
          Recipient Address
        </div>

        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter wallet address"
          style={{
            width: "100%",
            height: 56,
            borderRadius: 16,
            border: "1px solid #2A3F73",
            background: "#101933",
            color: "#fff",
            padding: "0 18px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Network */}

      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            marginBottom: 10,
            color: "#8EA2D8",
            fontSize: 14,
          }}
        >
          Network
        </div>

        <div
          style={{
            height: 56,
            borderRadius: 16,
            border: "1px solid #2A3F73",
            background: "#101933",
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
          }}
        >
          {coin.name} Network
        </div>
      </div>

      {/* Amount */}

      <div style={{ marginBottom: 30 }}>
        <div
          style={{
            marginBottom: 10,
            color: "#8EA2D8",
            fontSize: 14,
          }}
        >
          Amount
        </div>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`0 ${coin.symbol}`}
          style={{
            width: "100%",
            height: 56,
            borderRadius: 16,
            border: "1px solid #2A3F73",
            background: "#101933",
            color: "#fff",
            padding: "0 18px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Transfer Button */}

      <button
        style={{
          width: "100%",
          height: 56,
          borderRadius: 16,
          border: "none",
          background: "#456BFF",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
        }}
      >
        <Send size={18} />
        Transfer
      </button>
    </div>
  );
}