import React from "react";
import { NoticeItem } from "./types";
import {
  FileText,
  Paperclip,
  Bookmark,
  Share2,
  Eye,
  Download,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  Pin
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoticeCardsProps {
  notices: NoticeItem[];
  onViewNotice: (notice: NoticeItem) => void;
  onToggleBookmark: (id: string) => void;
  onToggleRead: (id: string) => void;
}

export const NoticeCards: React.FC<NoticeCardsProps> = ({
  notices,
  onViewNotice,
  onToggleBookmark,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleShare = (notice: NoticeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText?.(window.location.href + `#${notice.id}`);
    setCopiedId(notice.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPriorityStyle = (priority: NoticeItem["priority"]) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400";
      case "High":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400";
      case "Normal":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400";
      case "Low":
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {notices.map((notice) => {
        const hasAttachments = notice.attachments && notice.attachments.length > 0;

        return (
          <div
            key={notice.id}
            onClick={() => onViewNotice(notice)}
            className={`group relative flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/40 cursor-pointer ${
              !notice.read
                ? "border-l-4 border-l-primary bg-primary/[0.02]"
                : "border-border"
            }`}
          >
            <div>
              {/* Header Meta Line */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {notice.pinned && (
                    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <Pin className="h-3.5 w-3.5 fill-amber-500" /> Pinned
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityStyle(
                      notice.priority
                    )}`}
                  >
                    {notice.priority === "Urgent" && <AlertCircle className="h-3 w-3 mr-1" />}
                    {notice.priority}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                    {notice.category}
                  </span>
                  {!notice.read && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500 text-white">
                      New
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {notice.publishedDate}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
                {notice.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                {notice.shortDescription}
              </p>
            </div>

            {/* Footer Details & Quick Action Buttons */}
            <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium">
                  <Building2 className="h-3.5 w-3.5 text-primary/70" />
                  {notice.department}
                </span>
                {hasAttachments && (
                  <span className="flex items-center gap-1 font-medium text-primary">
                    <Paperclip className="h-3.5 w-3.5" />
                    {notice.attachments?.length} Attachment(s)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(notice.id);
                  }}
                  className={`h-8 px-2 text-xs ${
                    notice.bookmarked ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={notice.bookmarked ? "Remove Bookmark" : "Bookmark Notice"}
                >
                  <Bookmark className={`h-4 w-4 ${notice.bookmarked ? "fill-amber-500" : ""}`} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleShare(notice, e)}
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                  title="Share Notice Link"
                >
                  {copiedId === notice.id ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                </Button>

                {hasAttachments && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewNotice(notice);
                    }}
                    className="h-8 text-xs gap-1 border-border/80 hover:border-primary"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                )}

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onViewNotice(notice)}
                  className="h-8 text-xs gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Notice
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
