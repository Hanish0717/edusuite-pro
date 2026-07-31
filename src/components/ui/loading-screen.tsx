import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingScreen({
  message = "Loading portal...",
  fullScreen = true,
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 bg-background",
        fullScreen
          ? "fixed inset-0 z-50 h-screen w-screen"
          : "w-full min-h-[240px] rounded-2xl border border-border bg-card/20",
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glowing rings */}
        <div className="absolute size-10 rounded-full border border-primary/20 animate-ping" />
        <div className="absolute size-7 rounded-full border border-primary/45 animate-pulse" />

        {/* Core spinner */}
        <Loader2 className="size-8 animate-spin text-primary relative z-10" />
      </div>

      <p className="text-xs font-semibold tracking-wider text-muted-foreground animate-pulse uppercase">
        {message}
      </p>
    </div>
  );
}
