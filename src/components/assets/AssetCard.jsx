export default function AssetCard({
  logo,
  name,
  symbol,
  balance,
  value,
  price,
  change,
}) {
  const positive = change >= 0;

  return (
    <div
      style={{
        background: "#101933",
        border: "1px solid #24304D",
        borderRadius: 22,
        padding: 18,
        marginBottom: 18,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <img
            src={logo}
            alt={symbol}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
            }}
          />

          <div>
            <div
              style={{
                color: "#FFFFFF",
                fontSize: 19,
                fontWeight: 700,
              }}
            >
              {symbol}
            </div>

            <div
              style={{
                color: "#8EA2D8",
                marginTop: 4,
                fontSize: 14,
              }}
            >
              {name}
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "right",
          }}
        >
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            $
            {price.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </div>

          <div
            style={{
              marginTop: 4,
              color: positive
                ? "#22C55E"
                : "#EF4444",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {positive ? "+" : ""}
            {change.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Information */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 18,
        }}
      >
        <div>
          <div
            style={{
              color: "#8EA2D8",
              fontSize: 13,
            }}
          >
            Available
          </div>

          <div
            style={{
              marginTop: 6,
              color: "#FFFFFF",
              fontWeight: 700,
            }}
          >
            {balance}
          </div>
        </div>

        <div>
          <div
            style={{
              color: "#8EA2D8",
              fontSize: 13,
            }}
          >
            Value (USDT)
          </div>

          <div
            style={{
              marginTop: 6,
              color: "#FFFFFF",
              fontWeight: 700,
            }}
          >
            ${value}
          </div>
        </div>
      </div>
    </div>
  );
}