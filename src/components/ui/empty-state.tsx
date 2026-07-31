import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-border bg-card/40 min-h-[320px] max-w-lg mx-auto",
        className,
      )}
    >
      <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm animate-pulse">
        <Icon className="size-6" />
      </div>
      <h3 className="font-display text-base font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-brand-gradient shadow-glow rounded-xl h-9 px-4 text-xs font-semibold"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
