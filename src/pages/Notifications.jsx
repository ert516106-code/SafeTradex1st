import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCheck } from "lucide-react";
import NotificationTabs from "../components/notifications/NotificationTabs";
import NotificationCard from "../components/notifications/NotificationCard";
import NotificationDetails from "../components/notifications/NotificationDetails";
import NotificationEmpty from "../components/notifications/NotificationEmpty";
import { NOTIFICATION_CATEGORIES } from "../components/notifications/MockNotifications";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../services/notificationService";

export default function Notifications({ onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState(NOTIFICATION_CATEGORIES.ALL);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    const data = await getNotifications();
    setNotifications(data);
    setLoading(false);
  }

  async function handleSelect(notification) {
    setSelected(notification);
    if (!notification.read) {
      const updated = await markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
      setSelected(updated || { ...notification, read: true });
    }
  }

  async function handleMarkAllAsRead() {
    const updated = await markAllAsRead();
    setNotifications(updated);
  }

  const filtered = useMemo(() => {
    if (activeTab === NOTIFICATION_CATEGORIES.ALL) return notifications;
    return notifications.filter((n) => n.category === activeTab);
  }, [notifications, activeTab]);

  const hasUnread = notifications.some((n) => !n.read);

  if (selected) {
    return (
      <NotificationDetails
        notification={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 sticky top-0 bg-[#0a0e1a]/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <h1 className="text-white font-semibold text-base">Notifications</h1>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          disabled={!hasUnread}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full transition-colors ${
            hasUnread
              ? "text-purple-300 bg-purple-500/10 hover:bg-purple-500/20"
              : "text-slate-600 bg-white/[0.02] cursor-not-allowed"
          }`}
        >
          <CheckCheck size={14} />
          Mark all as read
        </button>
      </div>

      <NotificationTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {loading ? (
          <div className="text-center text-slate-400 text-sm py-16">
            Loading notifications...
          </div>
        ) : filtered.length === 0 ? (
          <NotificationEmpty />
        ) : (
          <div className="flex flex-col gap-2.5 pt-1">
            {filtered.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={handleSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
