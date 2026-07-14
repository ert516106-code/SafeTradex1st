import { useMarket } from "../../contexts/MarketContext";
import AssetCard from "./AssetCard";

export default function AssetList() {
  const { coins, loading } = useMarket();

  if (loading) {
    return (
      <div
        style={{
          color: "#94A3B8",
          textAlign: "center",
          padding: "40px 0",
        }}
      >
        Loading assets...
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          color: "#FFFFFF",
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 18,
        }}
      >
        My Assets
      </div>

      {coins.map((coin) => (
        <AssetCard
          key={coin.id}
          logo={coin.logo}
          name={coin.name}
          symbol={coin.symbol}
          balance={`0 ${coin.symbol}`}
          value="0.00"
          price={coin.price}
          change={coin.change}
        />
      ))}
    </div>
  );
}