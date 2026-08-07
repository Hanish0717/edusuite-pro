import { Calendar, FileCheck, Eye, Edit3, Download } from "lucide-react";
import type { PatentItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PatentCardsProps {
  patents: PatentItem[];
  onViewPatent?: (pat: PatentItem) => void;
  onEditPatent?: (pat: PatentItem) => void;
  onDownloadPatent?: (pat: PatentItem) => void;
}

export function PatentCards({
  patents,
  onViewPatent,
  onEditPatent,
  onDownloadPatent,
}: PatentCardsProps) {
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

  const handleView = (pat: PatentItem) => {
    if (onViewPatent) onViewPatent(pat);
    else toast.info("Viewing Patent", { description: `Patent Number: ${pat.patentNumber}` });
  };

  const handleEdit = (pat: PatentItem) => {
    if (onEditPatent) onEditPatent(pat);
    else toast.info("Edit Patent", { description: `Editing patent: ${pat.patentNumber}` });
  };

  const handleDownload = (pat: PatentItem) => {
    if (onDownloadPatent) onDownloadPatent(pat);
    else toast.success("Downloading Patent Certificate", { description: `Patent App No: ${pat.patentNumber}` });
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
                Patent Number: {pat.patentNumber}
              </p>
            </div>

            {/* Details panel */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/30 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground/75" />
                <span>Application Date: <strong className="text-foreground">{pat.filingDate}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground/75" />
                <span>Grant Date: <strong className="text-foreground">{pat.publicationDate || pat.filingDate}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/30 mt-4">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs flex-1 gap-1 font-semibold"
              onClick={() => handleView(pat)}
            >
              <Eye className="size-3.5" /> View
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs flex-1 gap-1 font-semibold"
              onClick={() => handleEdit(pat)}
            >
              <Edit3 className="size-3.5" /> Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs flex-1 gap-1 font-semibold text-indigo-600 hover:text-indigo-700"
              onClick={() => handleDownload(pat)}
            >
              <Download className="size-3.5" /> Download
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
