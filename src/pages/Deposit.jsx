import { ArrowLeft, Copy } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMarket } from "../contexts/MarketContext";

export default function Deposit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { coins } = useMarket();

  const coin = coins.find((c) => c.id === id);

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
            border: "1px solid #2E4278",
            background: "#101933",
            color: "#fff",
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
            Deposit {coin.name}
          </div>

          <div
            style={{
              color: "#90A5D8",
            }}
          >
            {coin.symbol} Network
          </div>
        </div>
      </div>

      {/* Network */}

      <div
        style={{
          background: "#101933",
          border: "1px solid #2E4278",
          borderRadius: 20,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            color: "#90A5D8",
            marginBottom: 8,
          }}
        >
          Network
        </div>

        <div
          style={{
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {coin.name}
        </div>
      </div>

      {/* Deposit Address */}

      <div
        style={{
          marginTop: 26,
        }}
      >
        <div
          style={{
            color: "#8EA2D8",
            fontSize: 14,
            marginBottom: 10,
            fontWeight: 500,
          }}
        >
          Deposit Address
        </div>

        <div
          style={{
            minHeight: 58,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            borderRadius: 16,
            background: "#101933",
            border: "1px solid #2A3F73",
            color: "#8EA2D8",
            fontSize: 15,
          }}
        >
        </div>
      </div>

      {/* Copy */}

      <button
        disabled={true}
        style={{
          width: "100%",
          height: 56,
          marginTop: 18,
          borderRadius: 16,
          border: "none",
          background: "#334155",
          color: "#94A3B8",
          fontWeight: 700,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          cursor: "not-allowed",
        }}
      >
        <Copy size={18} />
        Copy Address
      </button>

      {/* Notice */}

      <div
        style={{
          marginTop: 30,
          background: "#101933",
          border: "1px solid #2E4278",
          borderRadius: 18,
          padding: 18,
        }}
      >
        <div
          style={{
            color: "#FFD166",
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          Important Notice
        </div>

        <div
          style={{
            color: "#A8B8D8",
            lineHeight: 1.7,
            fontSize: 14,
          }}
        >
          Only deposit <b>{coin.symbol}</b> using the{" "}
          <b>{coin.name}</b> network.

          <br />
          <br />

          Wallet addresses will be assigned by the administrator.

          <br />
          <br />

          Sending unsupported assets may permanently lose your funds.
        </div>
      </div>
    </div>
  );
}