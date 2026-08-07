import React from "react";
import { NotificationItem } from "./types";
import { Bell, ShieldAlert, CheckCircle2, BookOpen, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
}

export function NotificationsDrawer({
  open,
  onClose,
  notifications,
  onMarkRead,
}: NotificationsDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-purple-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Library Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onMarkRead(notif.id)}
                className={`p-3.5 rounded-xl border text-xs space-y-1 transition-all cursor-pointer ${
                  notif.read
                    ? "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-500"
                    : "border-purple-200 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20 text-slate-800 dark:text-slate-100 font-medium"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">{notif.date}</span>
                  {!notif.read && (
                    <Badge className="bg-purple-600 text-white text-[8px] px-1 py-0 font-bold">
                      NEW
                    </Badge>
                  )}
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{notif.title}</h4>
                <p className="text-[11px] leading-relaxed">{notif.message}</p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">No notifications.</div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Button onClick={onClose} variant="outline" className="w-full text-xs font-bold rounded-xl h-9">
            Close Panel
          </Button>
        </div>
      </div>
    </div>
  );
}
