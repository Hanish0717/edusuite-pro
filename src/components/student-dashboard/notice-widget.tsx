import React from "react";
import { NoticeItem } from "@/components/notice-board/types";
import { Bell, ArrowRight, Calendar, Building2, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoticeWidgetProps {
  notices: NoticeItem[];
  onViewAll: () => void;
  onSelectNotice: (notice: NoticeItem) => void;
}

export const NoticeWidget: React.FC<NoticeWidgetProps> = ({
  notices,
  onViewAll,
  onSelectNotice,
}) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" /> Recent Announcements
          </h3>
          <p className="text-xs text-muted-foreground">Latest circulars and campus updates</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewAll}
          className="text-xs gap-1 h-8"
        >
          View All Updates <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="space-y-3">
        {notices.slice(0, 5).map((notice) => (
          <div
            key={notice.id}
            onClick={() => onSelectNotice(notice)}
            className="p-3.5 rounded-xl border border-border/80 bg-card hover:border-primary/40 transition-all cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {notice.pinned && <Pin className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {notice.category}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">
                  {notice.priority}
                </span>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {notice.publishedDate}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
              {notice.title}
            </h4>

            <p className="text-xs text-muted-foreground line-clamp-1">
              {notice.shortDescription}
            </p>

            <div className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium pt-1">
              <Building2 className="h-3 w-3 text-primary/70" /> {notice.department}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
