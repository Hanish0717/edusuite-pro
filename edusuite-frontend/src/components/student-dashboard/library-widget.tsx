import React from "react";
import { Library, BookMarked, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LibraryWidgetProps {
  onOpenLibrary: () => void;
}

export const LibraryWidget: React.FC<LibraryWidgetProps> = ({ onOpenLibrary }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Library className="h-4 w-4 text-primary" /> Library Snapshot
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
          No Outstanding Fines
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <BookMarked className="h-3 w-3 text-primary" /> Issued Books
          </span>
          <div className="text-sm font-bold text-foreground">2 Books</div>
        </div>

        <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-amber-500" /> Due Books
          </span>
          <div className="text-sm font-bold text-foreground">1 (Due Aug 14)</div>
        </div>

        <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Library className="h-3 w-3 text-emerald-500" /> Fine Amount
          </span>
          <div className="text-sm font-bold text-foreground">₹0.00</div>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onOpenLibrary}
        className="w-full text-xs gap-1 h-9"
      >
        Open Digital Library Portal <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
