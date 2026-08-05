import { useNavigate } from "react-router-dom";
import safetradeLogo from "../../assets/logo/safetrade-logo.png"; // Fixed path

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
          const parent = e.target.parentElement;
          const fallback = document.createElement("div");
          fallback.style.cssText = `
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: linear-gradient(135deg, #7C3AED, #2563EB);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 14px;
            color: #fff;
          `;
          fallback.textContent = "ST";
          parent.insertBefore(fallback, e.target);
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
