import React from "react";
import { Globe, Bell, MessageSquare, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  badgeText?: string;
  onOpenMessagingCenter?: (() => void) | undefined;
  unreadCount?: number;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon = Globe,
  actions,
  badgeText,
  onOpenMessagingCenter,
  unreadCount = 2,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F1B44] via-[#1A285D] to-[#2563EB] text-white p-6 shadow-xl space-y-4 border border-[#24356B]/50">
      <div className="absolute -right-10 -bottom-10 size-60 rounded-full bg-[#4D78FF]/10 blur-2xl pointer-events-none" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5">
          {badgeText && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-100 backdrop-blur-md text-[0.68rem] font-bold font-mono border border-white/20">
              <span className="size-2 rounded-full bg-[#4D78FF] animate-pulse" />
              {badgeText}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Icon className="size-7 text-[#4D78FF]" /> {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#8F9CC3] max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenMessagingCenter && (
            <Button
              onClick={onOpenMessagingCenter}
              variant="outline"
              className="relative bg-white/10 hover:bg-white/20 text-white border-white/20 h-9 px-3 rounded-xl backdrop-blur-md font-bold text-xs cursor-pointer gap-1.5"
            >
              <Bell className="size-4" />
              <span>Messages &amp; Requests</span>
              {unreadCount > 0 && (
                <span className="size-2.5 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </Button>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
};
