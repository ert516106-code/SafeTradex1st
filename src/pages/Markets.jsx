import { useState } from "react";
import { Search, ArrowLeft, CandlestickChart } from "lucide-react";
import CoinLogo from "../components/CoinLogo";
import { useNavigate } from "react-router-dom";

const coins = [
  { symbol: "BTC", name: "Bitcoin", price: "$63,638", change: "+2.35%", up: true },
  { symbol: "ETH", name: "Ethereum", price: "$1,673", change: "+1.87%", up: true },
  { symbol: "XRP", name: "XRP", price: "$0.51", change: "+0.92%", up: true },
  { symbol: "LTC", name: "Litecoin", price: "$82.30", change: "-1.14%", up: false },
  { symbol: "BNB", name: "BNB", price: "$605", change: "-0.54%", up: false },
];

export default function Markets() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(query.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      
      <div style={{
        display:"flex",
        alignItems:"center",
        gap:"10px",
        marginBottom:"20px"
      }}>
        <button onClick={() => navigate("/")}>
          <ArrowLeft size={20}/>
        </button>

        <h1>Markets</h1>
      </div>

      <div style={{
        display:"flex",
        alignItems:"center",
        border:"1px solid #ccc",
        padding:"10px",
        marginBottom:"20px"
      }}>
        <Search size={18}/>
        
        <input
          type="text"
          placeholder="Search coin..."
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          style={{
            border:"none",
            outline:"none",
            marginLeft:"10px",
            width:"100%"
          }}
        />
      </div>

      {filtered.map((coin)=>(
        <div
          key={coin.symbol}
          style={{
            display:"flex",
            justifyContent:"space-between",
            padding:"15px",
            borderBottom:"1px solid #ddd"
          }}
        >
          <div style={{
            display:"flex",
            alignItems:"center",
            gap:"10px"
          }}>
            <CoinLogo symbol={coin.symbol}/>
            
            <div>
              <div>{coin.name}</div>
              <small>{coin.symbol}</small>
            </div>
          </div>

          <div>
            <div>{coin.price}</div>

            <small
              style={{
                color: coin.up ? "green" : "red"
              }}
            >
              {coin.change}
            </small>
          </div>
        </div>
      ))}

      <div style={{
        marginTop:"20px",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        gap:"5px"
      }}>
        <CandlestickChart size={18}/>
        <span>Charts powered by TradingView</span>
      </div>

    </div>
  );
}
