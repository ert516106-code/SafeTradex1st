import { MOCK_NOTIFICATIONS } from "../components/notifications/MockNotifications";

// This service is the single integration point between the UI and the
// data source. Today it reads from local mock data. Later, each function
// below can be swapped to call the SafeTrade backend / Admin Dashboard
// API without requiring any changes to components or pages.

let localStore = MOCK_NOTIFICATIONS.map((n) => ({ ...n }));

export async function getNotifications() {
  // Future: return fetch(`${API_BASE}/notifications`).then(r => r.json());
  return Promise.resolve(
    [...localStore].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );
}

export async function markAsRead(id) {
  // Future: return fetch(`${API_BASE}/notifications/${id}/read`, { method: "POST" });
  localStore = localStore.map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  return Promise.resolve(localStore.find((n) => n.id === id));
}

export async function markAllAsRead() {
  // Future: return fetch(`${API_BASE}/notifications/read-all`, { method: "POST" });
  localStore = localStore.map((n) => ({ ...n, read: true }));
  return Promise.resolve([...localStore]);
}

// Future ready: the Admin Dashboard can push new notifications through
// this same shape without any UI changes.
export async function pushNotification(notification) {
  const newNotification = {
    id: notification.id || `n-${Date.now()}`,
    category: notification.category,
    type: notification.type,
    title: notification.title,
    description: notification.description,
    message: notification.message,
    createdAt: notification.createdAt || new Date().toISOString(),
    read: false,
  };
  localStore = [newNotification, ...localStore];
  return Promise.resolve(newNotification);
}
