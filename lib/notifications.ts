// ---- Notifications ----
// Real, localStorage-backed notification list (no backend/push infra exists,
// so nothing here is simulated—it's genuinely persisted read/unread state).
// Every account gets one seeded "Welcome to Studium" notification, dated to
// their real join date. `pushNotification` is exported so other real events
// (achievements, level-ups) can add to this feed later.

import { getUser } from "./onboarding";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string; // ISO timestamp
  read: boolean;
};

const NOTIFICATIONS_KEY = "studium_notifications";

function seedNotifications(): NotificationItem[] {
  const user = getUser();
  return [
    {
      id: "welcome",
      title: "Welcome to Studium 👋",
      body: "We're glad you're here. Pick a Learning Path, set up today's Study Plan, and start building your streak.",
      createdAt: user?.joinedAt ?? new Date().toISOString(),
      read: false
    }
  ];
}

function readList(): NotificationItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!raw) {
    const seeded = seedNotifications();
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(seeded));
    return seeded;
  }
  return JSON.parse(raw);
}

function saveList(list: NotificationItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
}

export function getNotifications(): NotificationItem[] {
  return readList().slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getUnreadCount(): number {
  return readList().filter(n => !n.read).length;
}

export function markNotificationRead(id: string) {
  saveList(readList().map(n => n.id === id ? { ...n, read: true } : n));
}

// Real bidirectional toggle (not just one-way mark-read)—lets a student
// un-read something they opened by accident, same as any real inbox.
export function toggleNotificationRead(id: string) {
  saveList(readList().map(n => n.id === id ? { ...n, read: !n.read } : n));
}

export function markAllNotificationsRead() {
  saveList(readList().map(n => ({ ...n, read: true })));
}

export function deleteNotification(id: string) {
  saveList(readList().filter(n => n.id !== id));
}

// For future real events (level-ups, achievements, streak milestones) to add
// their own notification. Ignores duplicate ids so an event can't double-post.
export function pushNotification(item: { id: string; title: string; body: string }) {
  const list = readList();
  if (list.some(n => n.id === item.id)) return;
  saveList([...list, { id: item.id, title: item.title, body: item.body, createdAt: new Date().toISOString(), read: false }]);
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Math.max(0, Date.now() - new Date(iso).getTime());
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
