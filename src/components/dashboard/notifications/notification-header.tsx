import { Bell, CheckCheck, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onRefresh: () => void;
  onOpenSettings: () => void;
  isRefreshing?: boolean;
}

export function NotificationHeader({
  unreadCount,
  onMarkAllAsRead,
  onRefresh,
  onOpenSettings,
  isRefreshing = false,
}: NotificationHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 relative">
          <Bell className="size-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 size-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center border-2 border-background animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-foreground leading-tight">
            Notifications
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Notification Center · Faculty Portal
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-bold"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="size-3.5" /> Mark All as Read
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-bold"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-bold"
          onClick={onOpenSettings}
        >
          <Settings className="size-3.5" /> Notification Settings
        </Button>
      </div>
    </div>
  );
}
