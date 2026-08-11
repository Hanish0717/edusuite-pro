import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onResetFilters?: () => void;
}

export function EmptyState({ onResetFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="size-20 rounded-3xl bg-muted/40 flex items-center justify-center border border-border/40">
        <FileQuestion className="size-10 text-muted-foreground/35" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground">No examinations scheduled</h3>
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
          There are no exams matching your search criteria or assigned filters for this semester.
        </p>
      </div>
      {onResetFilters && (
        <Button size="sm" onClick={onResetFilters} className="bg-brand-gradient text-white mt-2 h-8 text-xs font-bold shadow-glow">
          Clear Filters
        </Button>
      )}
    </div>
  );
}
