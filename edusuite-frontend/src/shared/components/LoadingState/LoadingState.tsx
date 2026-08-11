import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Retrieving records from database..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[250px] border border-border/40 rounded-2xl p-10 bg-card/10">
      <Loader2 className="size-8 text-primary animate-spin mb-4" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse font-display">{message}</p>
    </div>
  );
}
