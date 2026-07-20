import { NOTIFICATION_CATEGORIES } from "./MockNotifications";

const TABS = [
  { key: NOTIFICATION_CATEGORIES.ALL, label: "All" },
  { key: NOTIFICATION_CATEGORIES.TRANSACTIONS, label: "Transactions" },
  { key: NOTIFICATION_CATEGORIES.SECURITY, label: "Security" },
  { key: NOTIFICATION_CATEGORIES.ANNOUNCEMENTS, label: "Announcements" },
];

export default function NotificationTabs({ activeTab, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3">
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/40"
                : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
