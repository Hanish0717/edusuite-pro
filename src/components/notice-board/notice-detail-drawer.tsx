import React from "react";
import { NoticeItem } from "./types";
import {
  FileText,
  Paperclip,
  Bookmark,
  Share2,
  Download,
  Printer,
  Calendar,
  Building2,
  User,
  X,
  ExternalLink,
  CheckCircle2,
  Clock,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoticeDetailDrawerProps {
  notice: NoticeItem | null;
  onClose: () => void;
  onToggleBookmark: (id: string) => void;
}

export const NoticeDetailDrawer: React.FC<NoticeDetailDrawerProps> = ({
  notice,
  onClose,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!notice) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex justify-end transition-all">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl bg-card border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-border flex items-start justify-between gap-4 bg-muted/20">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                {notice.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {notice.priority} Priority
              </span>
              {notice.pinned && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Pinned Notice
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {notice.title}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Issued Info Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 border border-border text-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> Department
              </span>
              <p className="font-semibold text-foreground">{notice.department}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> Issued By
              </span>
              <p className="font-semibold text-foreground">{notice.issuedBy}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Issue Date
              </span>
              <p className="font-medium text-foreground">{notice.publishedDate}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Expiry Date
              </span>
              <p className="font-medium text-foreground">{notice.expiryDate}</p>
            </div>
          </div>

          {/* Full Notice Content */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Notice Details
            </h3>
            <div className="p-4 rounded-xl border border-border bg-card text-foreground text-sm leading-relaxed space-y-3 whitespace-pre-line">
              {notice.fullNotice}
            </div>
          </div>

          {/* Attachments Section */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Paperclip className="h-4 w-4 text-primary" /> Official Attachments ({notice.attachments.length})
              </h3>
              <div className="space-y-2">
                {notice.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{att.name}</p>
                        <p className="text-xs text-muted-foreground">{att.size || "PDF Document"}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`Downloading ${att.name}...`)}
                      className="h-8 gap-1 text-xs"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Links */}
          {notice.relatedLinks && notice.relatedLinks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Related Resources
              </h3>
              <div className="space-y-2">
                {notice.relatedLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:border-primary/50 text-sm text-primary transition-colors"
                  >
                    <span className="font-medium">{link.title}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-border bg-muted/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleBookmark(notice.id)}
              className={`gap-1.5 text-xs ${
                notice.bookmarked ? "text-amber-500 border-amber-500/30" : ""
              }`}
            >
              <Bookmark className={`h-4 w-4 ${notice.bookmarked ? "fill-amber-500" : ""}`} />
              {notice.bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-xs"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Copied Link
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" /> Share
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs"
            >
              <Printer className="h-4 w-4" /> Print
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => alert(`Downloading full notice payload for ${notice.title}...`)}
              className="gap-1.5 text-xs"
            >
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
