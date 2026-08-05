import { useNavigate } from "react-router-dom";
import safetradeLogo from "../../assets/safetrade-logo.png";

export default function Logo() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/home")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
      }}
    >
      {/* SafeTrade Logo */}
      <img
        src={safetradeLogo}
        alt="SafeTrade"
        style={{
          width: 44,
          height: 44,
          objectFit: "contain",
        }}
        onError={(e) => {
          // Fallback if image doesn't load
          e.target.style.display = "none";
        }}
      />
      
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
      </div>
    </div>
  );
}
