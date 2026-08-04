import { Check, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AnalyticsReport } from "../../types";

interface ExportDialogProps {
  report: AnalyticsReport | null;
  format: "PDF" | "Excel" | "CSV";
  onFormatChange: (format: "PDF" | "Excel" | "CSV") => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExportDialog({
  report,
  format,
  onFormatChange,
  onClose,
  onConfirm,
}: ExportDialogProps) {
  return (
    <Dialog open={report !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Export Parameters</DialogTitle>
          <DialogDescription>
            Select your preferred export layout for:{" "}
            <strong className="text-foreground">
              {report?.title}
            </strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Select Output Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["PDF", "Excel", "CSV"] as const).map((fmt) => {
              const isSupported = report?.formats.includes(fmt);
              const isSelected = format === fmt;

              return (
                <button
                  key={fmt}
                  disabled={!isSupported}
                  onClick={() => onFormatChange(fmt)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary font-bold"
                      : isSupported
                      ? "border-border hover:bg-muted/80 text-foreground font-medium"
                      : "border-border/40 bg-muted/10 opacity-40 cursor-not-allowed text-muted-foreground"
                  }`}
                >
                  <span className="text-sm">{fmt}</span>
                  {isSelected && <Check className="size-3.5 mt-1 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="font-semibold cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer gap-1.5"
          >
            <Database className="size-3.5" /> Download File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
