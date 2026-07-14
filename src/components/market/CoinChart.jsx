import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
} from "recharts";
import { getCoinChart } from "../../services/chartService";

const PERIODS = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

export default function CoinChart({ coinId, currentPrice, change }) {
  const [period, setPeriod] = useState("1D");
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadChart() {
      try {
        setLoading(true);
        setError("");
        const data = await getCoinChart(coinId, period);
        if (!active) return;
        setChart(data);
      } catch (err) {
        console.error(err);
        if (active) {
          setError("Unable to load chart.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (coinId) {
      loadChart();
    }

    return () => {
      active = false;
    };
  }, [coinId, period]);

  const chartData = useMemo(() => {
    return chart.map((item) => ({
      ...item,
      label: formatTime(item.time, period),
    }));
  }, [chart, period]);

  const lineColor = change >= 0 ? "#22C55E" : "#EF4444";

  const latestPrice =
    chartData.length > 0
      ? chartData[chartData.length - 1].price
      : currentPrice;

  const yDomain = useMemo(() => {
    if (!chartData.length) return ["auto", "auto"];

    const prices = chartData.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1 || max * 0.01 || 1;

    return [min - padding, max + padding];
  }, [chartData]);

  return (
    <div
      style={{
        background: "linear-gradient(180deg,#132758,#0F1834)",
        border: "1px solid #2D4380",
        borderRadius: 20,
        padding: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <div>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            $
            {Number(latestPrice || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            })}
          </div>

          <div
            style={{
              marginTop: 4,
              color: lineColor,
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}%
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 12,
          overflowX: "auto",
        }}
      >
        {PERIODS.map((item) => (
          <button
            key={item}
            onClick={() => setPeriod(item)}
            style={{
              border: "none",
              cursor: "pointer",
              borderRadius: 10,
              padding: "6px 10px",
              fontWeight: 600,
              fontSize: 12,
              flexShrink: 0,
              background: period === item ? "#3468FF" : "#162446",
              color: "#FFFFFF",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div
          style={{
            height: 150,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#8FA4D8",
            fontSize: 13,
          }}
        >
          Loading chart...
        </div>
      ) : error ? (
        <div
          style={{
            height: 150,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#EF4444",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      ) : (
        <div style={{ width: "100%", height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
            >
              <XAxis
                dataKey="label"
                tick={{ fill: "#6B7FAE", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                minTickGap={40}
              />

              <YAxis
                domain={yDomain}
                hide
              />

              <ReferenceLine
                y={currentPrice}
                stroke="#6B7FAE"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
                ifOverflow="hidden"
              />

              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) {
    return null;
  }
  const price = payload[0].value;
  return (
    <div
      style={{
        background: "#0F1834",
        border: "1px solid #2D4380",
        borderRadius: 12,
        padding: "8px 12px",
        boxShadow: "0 10px 30px rgba(0,0,0,.35)",
      }}
    >
      <div style={{ color: "#8FA4D8", fontSize: 11, marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 14 }}>
        $
        {Number(price).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        })}
      </div>
    </div>
  );
}

function formatTime(timestamp, period) {
  const date = new Date(timestamp);
  switch (period) {
    case "1D":
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    case "1W":
    case "1M":
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    case "3M":
    case "1Y":
    case "ALL":
      return date.toLocaleDateString([], { month: "short", year: "2-digit" });
    default:
      return date.toLocaleDateString();
  }
}