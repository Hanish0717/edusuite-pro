import { Save, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveBarProps {
  show: boolean;
  onSave: () => void;
  onReset: () => void;
}

export function SaveBar({ show, onSave, onReset }: SaveBarProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-64 z-40 bg-card border border-primary/30 p-3.5 rounded-2xl shadow-xl shadow-primary/10 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
        <AlertCircle className="size-4 text-primary animate-pulse shrink-0" />
        <span>You have unsaved setting changes.</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-7 text-xs font-bold" onClick={onReset}>
          <RotateCcw className="size-3" /> Discard
        </Button>
        <Button size="sm" className="h-7 text-xs font-bold bg-brand-gradient text-white shadow-glow gap-1" onClick={onSave}>
          <Save className="size-3" /> Save Changes
        </Button>
      </div>
    </div>
  );
}
