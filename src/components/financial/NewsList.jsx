import { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import { getCryptoNews } from "../../services/newsService";

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      const data = await getCryptoNews();

      setNews(data);
      setLoading(false);
    }

    loadNews();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          color: "#94A3B8",
          textAlign: "center",
          padding: 30,
        }}
      >
        Loading latest crypto news...
      </div>
    );
  }

  return (
    <>
      {news.map((article) => (
        <NewsCard
          key={article.id}
          article={article}
        />
      ))}
    </>
  );
}