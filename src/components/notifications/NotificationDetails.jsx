import { ArrowLeft } from "lucide-react";
import { getNotificationVisual } from "./NotificationCard";

function formatFullDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationDetails({ notification, onBack }) {
  if (!notification) return null;

  const { icon: Icon, bg, color } = getNotificationVisual(notification.type);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0e1a] flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-white font-semibold text-base">Details</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${bg} mb-5`}
        >
          <Icon size={28} className={color} />
        </div>

        <h2 className="text-white text-xl font-bold mb-1.5">
          {notification.title}
        </h2>
        <p className="text-slate-500 text-xs mb-6">
          {formatFullDateTime(notification.createdAt)}
        </p>

        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
}
