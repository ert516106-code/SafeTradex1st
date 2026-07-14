export default function FinancialCard({
  icon,
  title,
  subtitle,
  value,
  color = "#22C55E",
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#101933",
        border: "1px solid #24304D",
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 18,
            background:
              "linear-gradient(180deg,#2C2C73,#22245D)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#FFFFFF",
          }}
        >
          {icon}
        </div>

        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 4,
              color: "#8EA2D8",
              fontSize: 14,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      <div
        style={{
          color,
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        {value}
      </div>
    </div>
  );
}