import { BookOpen, Calendar, Key, Download, Eye, Edit3, Trash2 } from "lucide-react";
import type { PublicationItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PublicationCardsProps {
  publications: PublicationItem[];
  onViewPublication?: (pub: PublicationItem) => void;
  onEditPublication?: (pub: PublicationItem) => void;
  onDeletePublication?: (pub: PublicationItem) => void;
  onDownloadPublication?: (pub: PublicationItem) => void;
}

export function PublicationCards({
  publications,
  onViewPublication,
  onEditPublication,
  onDeletePublication,
  onDownloadPublication,
}: PublicationCardsProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25";
      case "Accepted":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25";
      case "Under Review":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/25";
    }
  };

  const handleDownload = (pub: PublicationItem) => {
    if (onDownloadPublication) {
      onDownloadPublication(pub);
    } else {
      toast.success("Downloading Manuscript", {
        description: `Downloading full-text PDF for: "${pub.title}"`
      });
    }
  };

  const handleView = (pub: PublicationItem) => {
    if (onViewPublication) {
      onViewPublication(pub);
    } else {
      toast.info("Viewing Publication", {
        description: `Paper: "${pub.title}" (${pub.year})`
      });
    }
  };

  const handleDelete = (pub: PublicationItem) => {
    if (onDeletePublication) {
      onDeletePublication(pub);
    } else {
      toast.success(`Publication "${pub.title}" deleted.`);
    }
  };

  if (publications.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No publications found matching your filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {publications.map((pub) => (
        <div
          key={pub.id}
          className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border/50 bg-card hover:shadow-md hover:border-primary/20 transition-all duration-200"
        >
          <div className="space-y-3">
            {/* Header tags */}
            <div className="flex items-start justify-between gap-3">
              <Badge variant="outline" className="bg-muted text-muted-foreground font-semibold">
                {pub.type}
              </Badge>
              <Badge variant="outline" className={getStatusBadgeClass(pub.status)}>
                {pub.status}
              </Badge>
            </div>

            {/* Paper Title & Authors */}
            <div>
              <h4 className="font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {pub.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium italic">
                Authors: {pub.authors}
              </p>
            </div>

            {/* Publication Info block */}
            <div className="text-[11px] text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/30 space-y-1.5">
              <p className="flex items-center gap-1.5 leading-snug">
                <BookOpen className="size-3.5 shrink-0" />
                <span>Journal/Conference: <strong className="text-foreground">{pub.journalOrConference}</strong></span>
              </p>
              <div className="flex items-center gap-4 border-t border-border/40 pt-1.5 mt-1.5 flex-wrap">
                <p className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 shrink-0" />
                  <span>Year: <strong className="text-foreground">{pub.year}</strong></span>
                </p>
                {pub.doi && (
                  <p className="flex items-center gap-1.5">
                    <Key className="size-3.5 shrink-0" />
                    <span className="truncate">DOI: <strong className="text-foreground">{pub.doi}</strong></span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-1 pt-3 border-t border-border/30 mt-4 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs px-2 gap-1 font-semibold"
              onClick={() => handleView(pub)}
            >
              <Eye className="size-3.5" /> View
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs px-2 gap-1 font-semibold"
              onClick={() => onEditPublication && onEditPublication(pub)}
            >
              <Edit3 className="size-3.5" /> Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs px-2 gap-1 font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              onClick={() => handleDelete(pub)}
            >
              <Trash2 className="size-3.5" /> Delete
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs px-2 gap-1 font-semibold text-indigo-600 hover:text-indigo-700"
              onClick={() => handleDownload(pub)}
            >
              <Download className="size-3.5" /> Download
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
