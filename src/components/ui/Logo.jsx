import logo from "../../assets/logo/safetrade-logo.png";
import { useNavigate } from "react-router-dom";
import safetradeLogo from "../../assets/safetrade-logo.png";

export default function Logo() {
  const navigate = useNavigate();

export default function Logo({
  size = 56,
  showText = true,
}) {
  return (
    <div
      onClick={() => navigate("/home")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        gap: 12,
        cursor: "pointer",
      }}
    >
      {/* SafeTrade Logo */}
      <img
        src={logo}
        alt="SafeTrade Logo"
        src={safetradeLogo}
        alt="SafeTrade"
        style={{
          width: size,
          height: size,
          width: 44,
          height: 44,
          objectFit: "contain",
          display: "block",
          background: "transparent",
          border: "none",
          borderRadius: 0,
          boxShadow: "none",
        }}
        onError={(e) => {
          // Fallback if image doesn't load
          e.target.style.display = "none";
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
      
      {/* Brand Name */}
      <div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
          }}
        >
          SafeTrade
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#94A3B8",
            fontWeight: 400,
            letterSpacing: "0.3px",
          }}
        >
          Secure Crypto Exchange
        </div>
      )}
      </div>
    </div>
  );
}
}
