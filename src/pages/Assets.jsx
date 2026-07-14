import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import BalanceCard from "../components/assets/BalanceCard";
import AssetActions from "../components/assets/AssetActions";
import AssetList from "../components/assets/AssetList";

export default function Assets() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#1E3170 0%,#091120 70%)",
        padding: 20,
        color: "#FFFFFF",
        paddingBottom: 110,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            border: "1px solid #293B66",
            background: "#101933",
            color: "#FFFFFF",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            Assets
          </div>

          <div
            style={{
              color: "#8FA4D8",
              marginTop: 4,
            }}
          >
            Manage your crypto portfolio
          </div>
        </div>
      </div>

      <BalanceCard />

      <AssetActions />

      <AssetList />
    </div>
  );
}