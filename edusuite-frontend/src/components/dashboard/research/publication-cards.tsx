import { BookOpen, Calendar, Key, Link as LinkIcon, Download, Eye, Edit3, Award, ExternalLink } from "lucide-react";
import type { PublicationItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PublicationCardsProps {
  publications: PublicationItem[];
  onEditPublication?: (pub: PublicationItem) => void;
}

export function PublicationCards({ publications, onEditPublication }: PublicationCardsProps) {
  const getIndexingBadgeClass = (indexing: string) => {
    switch (indexing) {
      case "SCI":
      case "SCIE":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
      case "Scopus":
        return "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20";
      case "Google Scholar":
        return "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20";
      default:
        return "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20";
    }
  };

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
    toast.success("Downloading Manuscript", {
      description: `Downloading full-text PDF for: "${pub.title}"`
    });
  };

  const handleView = (pub: PublicationItem) => {
    toast.info("Opening external database", {
      description: `Navigating to DOI publisher index link: ${pub.doi ?? "N/A"}`
    });
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
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getIndexingBadgeClass(pub.indexing)}>
                  {pub.indexing}
                </Badge>
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  {pub.type}
                </Badge>
              </div>
              <Badge variant="outline" className={getStatusBadgeClass(pub.status)}>
                {pub.status}
              </Badge>
            </div>

            {/* Paper Title */}
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
                <span>Journal: <strong className="text-foreground">{pub.journalOrConference}</strong></span>
              </p>
              <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-1.5 mt-1.5">
                <p className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 shrink-0" />
                  <span>Year: <strong className="text-foreground">{pub.year}</strong></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Award className="size-3.5 shrink-0" />
                  <span>Publisher: <strong className="text-foreground">{pub.publisher}</strong></span>
                </p>
              </div>
              {(pub.doi || pub.issnOrIsbn) && (
                <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-1.5">
                  {pub.doi && (
                    <p className="flex items-center gap-1.5">
                      <Key className="size-3.5 shrink-0" />
                      <span className="truncate">DOI: <strong className="text-foreground">{pub.doi}</strong></span>
                    </p>
                  )}
                  {pub.issnOrIsbn && (
                    <p className="flex items-center gap-1.5">
                      <LinkIcon className="size-3.5 shrink-0" />
                      <span className="truncate">ISBN: <strong className="text-foreground">{pub.issnOrIsbn}</strong></span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-1.5 pt-4 border-t border-border/30 mt-4">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs flex-1 gap-1 font-bold text-muted-foreground hover:text-foreground"
              onClick={() => handleView(pub)}
            >
              <Eye className="size-3.5" /> View
            </Button>
            {pub.documentUrl && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs flex-1 gap-1 font-bold text-muted-foreground hover:text-foreground"
                onClick={() => handleDownload(pub)}
              >
                <Download className="size-3.5" /> Download
              </Button>
            )}
            {onEditPublication && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs flex-1 gap-1 font-bold text-primary hover:bg-primary/5"
                onClick={() => onEditPublication(pub)}
              >
                <Edit3 className="size-3.5" /> Edit
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
