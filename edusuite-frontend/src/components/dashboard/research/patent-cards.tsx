import { Award, Calendar, FileCheck, Globe } from "lucide-react";
import type { PatentItem } from "./types";
import { Badge } from "@/components/ui/badge";

interface PatentCardsProps {
  patents: PatentItem[];
}

export function PatentCards({ patents }: PatentCardsProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Granted":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
      case "Published":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20";
      case "Filed":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20";
      default:
        return "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20";
    }
  };

  if (patents.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No patents recorded.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {patents.map((pat) => (
        <div
          key={pat.id}
          className="flex flex-col justify-between p-5 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-3">
            {/* Header tags */}
            <div className="flex items-start justify-between gap-3">
              <div className="size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <FileCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge variant="outline" className={getStatusBadgeClass(pat.status)}>
                {pat.status}
              </Badge>
            </div>

            {/* Patent Title */}
            <div>
              <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-2">
                {pat.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1.5 font-mono">
                App No: {pat.patentNumber}
              </p>
            </div>

            {/* Details panel */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/30 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground/75" />
                <span>Filing: <strong className="text-foreground">{pat.filingDate}</strong></span>
              </div>
              {pat.publicationDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-muted-foreground/75" />
                  <span>Published: <strong className="text-foreground">{pat.publicationDate}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-1.5 col-span-2 mt-1">
                <Globe className="size-3.5 text-muted-foreground/75" />
                <span>Jurisdiction: <strong className="text-foreground">{pat.country}</strong></span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
