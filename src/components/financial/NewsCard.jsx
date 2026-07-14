import { ExternalLink } from "lucide-react";

export default function NewsCard({ article }) {
  if (!article) {
    return null;
  }

  return (
    <a
      href={article.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        gap: 14,
        padding: 16,
        background: "#101933",
        border: "1px solid #24304D",
        borderRadius: 18,
        textDecoration: "none",
        color: "#fff",
        marginBottom: 14,
      }}
    >
      <img
        src={article.image}
        alt={article.title}
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          objectFit: "cover",
        }}
      />

      <div style={{ flex: 1 }}>
        <div
          style={{
            color: "#8EA2D8",
            fontSize: 12,
            marginBottom: 6,
          }}
        >
          {article.time}
        </div>

        <div
          style={{
            fontWeight: 700,
            lineHeight: 1.5,
            marginBottom: 8,
          }}
        >
          {article.title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6F8DEB",
            fontSize: 13,
          }}
        >
          {article.source}

          <ExternalLink size={16} />
        </div>
      </div>
    </a>
  );
}