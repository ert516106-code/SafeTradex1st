import logo from "../../assets/logo/safetrade-logo.png";

export default function Logo({
  size = 56,
  showText = true,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <img
        src={logo}
        alt="SafeTrade Logo"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          display: "block",
          background: "transparent",
          border: "none",
          borderRadius: 0,
          boxShadow: "none",
        }}
      />

      {showText && (
        <div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#ffffff",
            }}
          >
            Safe
            <span
              style={{
                color: "#6D5DFF",
              }}
            >
              Trade
            </span>
          </div>

          <div
            style={{
              marginTop: "4px",
              fontSize: "12px",
              color: "#94A3B8",
              letterSpacing: ".4px",
            }}
          >
            Secure Crypto Exchange
          </div>
        </div>
      )}
    </div>
  );
}