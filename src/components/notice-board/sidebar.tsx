import React from "react";
import { NoticeItem, DeadlineItem, HolidayItem } from "./types";
import { QuickActions } from "./quick-actions";
import { Pin, Calendar, AlertTriangle, PartyPopper, BellRing, ChevronRight } from "lucide-react";

interface NoticeSidebarProps {
  pinnedNotices: NoticeItem[];
  recentNotices: NoticeItem[];
  deadlines: DeadlineItem[];
  holidays: HolidayItem[];
  onSelectNotice: (notice: NoticeItem) => void;
}

export const NoticeSidebar: React.FC<NoticeSidebarProps> = ({
  pinnedNotices,
  recentNotices,
  deadlines,
  holidays,
  onSelectNotice,
}) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions Widget */}
      <QuickActions />

      {/* Pinned Notices Widget */}
      {pinnedNotices.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Pin className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Featured Updates
          </h3>
          <div className="space-y-2">
            {pinnedNotices.slice(0, 4).map((notice) => (
              <div
                key={notice.id}
                onClick={() => onSelectNotice(notice)}
                className="p-2.5 rounded-lg border border-border/60 bg-amber-500/[0.04] hover:bg-amber-500/10 hover:border-amber-500/30 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between gap-1 text-[11px]">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {notice.category}
                  </span>
                  <span className="text-muted-foreground">{notice.publishedDate}</span>
                </div>
                <p className="text-xs font-semibold text-foreground line-clamp-1">
                  {notice.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Deadlines Widget */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-red-500" /> Upcoming Deadlines
        </h3>
        <div className="space-y-2">
          {deadlines.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs"
            >
              <div>
                <p className="font-semibold text-foreground line-clamp-1">{item.title}</p>
                <span className="text-[11px] text-muted-foreground">{item.category}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded font-medium text-[10px] shrink-0 ${
                  item.urgent
                    ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Holidays Widget */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <PartyPopper className="h-3.5 w-3.5 text-emerald-500" /> Upcoming Holidays
        </h3>
        <div className="space-y-2">
          {holidays.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-emerald-500/[0.03] text-xs"
            >
              <div>
                <p className="font-semibold text-foreground line-clamp-1">{h.title}</p>
                <span className="text-[11px] text-muted-foreground">{h.day}</span>
              </div>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                {h.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
