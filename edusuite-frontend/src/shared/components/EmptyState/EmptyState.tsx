import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function EmptyState({
  title = "No results found",
  description = "Adjust your search parameters or filters to locate student records.",
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-2xl p-10 text-center bg-card/25 animate-in fade-in duration-300">
      <div className="rounded-2xl bg-muted/65 p-4 mb-4 text-muted-foreground/80">
        <Search className="size-8 text-primary/70" />
      </div>
      <h3 className="text-base font-bold mb-1 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-5 leading-normal">{description}</p>
      {onReset && (
        <Button onClick={onReset} size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer">
          Reset All Filters
        </Button>
      )}
    </div>
  );
}
