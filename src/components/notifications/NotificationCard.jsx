import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Repeat,
  ShieldAlert,
  Megaphone,
  Gift,
  Bell,
} from "lucide-react";
import { NOTIFICATION_TYPES } from "./MockNotifications";

const ICON_MAP = {
  [NOTIFICATION_TYPES.DEPOSIT]: {
    icon: ArrowDownToLine,
    bg: "from-emerald-500/30 to-emerald-700/20",
    color: "text-emerald-400",
  },
  [NOTIFICATION_TYPES.WITHDRAWAL]: {
    icon: ArrowUpFromLine,
    bg: "from-orange-500/30 to-orange-700/20",
    color: "text-orange-400",
  },
  [NOTIFICATION_TYPES.TRANSFER]: {
    icon: ArrowLeftRight,
    bg: "from-blue-500/30 to-blue-700/20",
    color: "text-blue-400",
  },
  [NOTIFICATION_TYPES.CONVERT]: {
    icon: Repeat,
    bg: "from-purple-500/30 to-purple-700/20",
    color: "text-purple-400",
  },
  [NOTIFICATION_TYPES.SECURITY_ALERT]: {
    icon: ShieldAlert,
    bg: "from-red-500/30 to-red-700/20",
    color: "text-red-400",
  },
  [NOTIFICATION_TYPES.ANNOUNCEMENT]: {
    icon: Megaphone,
    bg: "from-indigo-500/30 to-indigo-700/20",
    color: "text-indigo-400",
  },
  [NOTIFICATION_TYPES.PROMO]: {
    icon: Gift,
    bg: "from-pink-500/30 to-pink-700/20",
    color: "text-pink-400",
  },
};

export function getNotificationVisual(type) {
  return ICON_MAP[type] || { icon: Bell, bg: "from-slate-500/30 to-slate-700/20", color: "text-slate-400" };
}

function getRelativeTime(isoString) {
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  return `${diffDay} days ago`;
}

export default function NotificationCard({ notification, onClick }) {
  const { icon: Icon, bg, color } = getNotificationVisual(notification.type);
  const timeAgo = getRelativeTime(notification.createdAt);

  return (
    <button
      onClick={() => onClick(notification)}
      className={`w-full flex items-start gap-3 p-4 rounded-2xl border transition-all text-left ${
        notification.read
          ? "bg-white/[0.03] border-white/5"
          : "bg-white/[0.06] border-white/10"
      } hover:bg-white/[0.08] active:scale-[0.99]`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${bg}`}
      >
        <Icon size={20} className={color} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={`text-sm truncate ${
              notification.read
                ? "text-slate-300 font-medium"
                : "text-white font-semibold"
            }`}
          >
            {notification.title}
          </h3>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          )}
        </div>
        <p className="text-slate-400 text-xs mt-1 line-clamp-2">
          {notification.description}
        </p>
        <span className="text-[11px] text-slate-500 mt-1.5 block">
          {timeAgo}
        </span>
      </div>
    </button>
  );
}
