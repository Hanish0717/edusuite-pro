import type { Notification } from "../types/NotificationTypes";

export function isExpired(notification: Notification): boolean {
  if (!notification.expires_at) return false;
  return new Date(notification.expires_at).getTime() < Date.now();
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
