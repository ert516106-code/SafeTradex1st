export default function NewsCard({ article }) {
  if (!article) return null;

  const timeAgo = getRelativeTime(article.publishedAt);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 p-4 border-b border-white/5 last:border-b-0 hover:bg-white/[0.03] transition-colors"
    >
      {article.imageUrl ? (
        <img
          src={article.imageUrl}
          alt=""
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-white/5"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className="w-16 h-16 rounded-xl flex-shrink-0 bg-gradient-to-br from-purple-600/40 to-blue-600/40" />
      )}

      <div className="min-w-0 flex-1">
        <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2">
          {article.title}
        </h3>
        {article.description ? (
          <p className="text-slate-400 text-xs mt-1 line-clamp-2">
            {article.description}
          </p>
        ) : null}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[11px] text-purple-300 font-medium">
            {article.source}
          </span>
          <span className="text-[11px] text-slate-500">•</span>
          <span className="text-[11px] text-slate-500">{timeAgo}</span>
        </div>
      </div>
    </a>
  );
}

function getRelativeTime(isoString) {
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}
