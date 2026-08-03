import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateAssessment: () => void;
}

export function EmptyState({ onCreateAssessment }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="size-20 rounded-3xl bg-muted/30 flex items-center justify-center border border-border/40">
        <FileQuestion className="size-10 text-muted-foreground/40" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground">No assessments found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          No assessments created yet or your filters returned no results.
        </p>
      </div>
      <Button size="sm" onClick={onCreateAssessment} className="bg-gradient-to-r from-primary to-primary/80 mt-2">
        Create First Assessment
      </Button>
    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/30 bg-card p-5 space-y-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-muted/50" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-muted/50 rounded w-3/4" />
              <div className="h-2.5 bg-muted/30 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 bg-muted/40 rounded" />
            <div className="h-2 bg-muted/30 rounded w-5/6" />
          </div>
          <div className="h-1.5 bg-muted/30 rounded-full" />
          <div className="flex items-center justify-between">
            <div className="h-5 bg-muted/40 rounded-lg w-20" />
            <div className="h-4 bg-muted/30 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
