import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import NewsCard from "./NewsCard";
import { getCryptoNews } from "../../services/newsService";

const AUTO_REFRESH_MS = 12 * 60 * 60 * 1000; // 12 hours

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success
  const refreshTimerRef = useRef(null);

  async function loadNews() {
    const data = await getCryptoNews();
    setNews(Array.isArray(data) ? data : []);
    setStatus("success");
  }

  useEffect(() => {
    loadNews();
    refreshTimerRef.current = setInterval(loadNews, AUTO_REFRESH_MS);
    return () => clearInterval(refreshTimerRef.current);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 text-slate-400 text-sm py-10">
        <RefreshCw size={16} className="animate-spin" />
        Loading latest crypto news...
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-10 px-6">
        <p className="text-slate-400 text-sm">No news available right now.</p>
      </div>
    );
  }

  return (
    <div>
      {news.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
