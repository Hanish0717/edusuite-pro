import { BellOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onRefresh: () => void;
  message?: string;
}

export function EmptyState({ onRefresh, message = "No new notifications." }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/60 bg-card/40 my-4 space-y-4">
      <div className="size-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-glow">
        <BellOff className="size-8" />
      </div>

      <div className="max-w-xs space-y-1">
        <h3 className="text-base font-bold text-foreground">{message}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You are all caught up! There are no pending alerts matching your current filter criteria.
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs font-bold mt-2"
        onClick={onRefresh}
      >
        <RefreshCw className="size-3.5" /> Refresh Notifications
      </Button>
    </div>
  );
}
