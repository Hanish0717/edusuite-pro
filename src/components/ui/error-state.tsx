import { AlertTriangle, ChevronDown, RefreshCw } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  errorDetails?: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this section. Please try again or contact support if the issue persists.",
  onRetry,
  errorDetails,
  className,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-destructive/20 bg-destructive/5 max-w-lg mx-auto min-h-[320px]",
        className,
      )}
    >
      <div className="grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive mb-4 shadow-sm">
        <AlertTriangle className="size-6" />
      </div>
      <h3 className="font-display text-base font-bold text-destructive mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground/80 mb-6 max-w-sm">{description}</p>

      <div className="flex flex-col gap-2.5 items-center w-full">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl h-9 px-4 text-xs font-semibold gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            Retry Request
          </Button>
        )}

        {errorDetails && (
          <div className="w-full mt-2">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-center gap-1 mx-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{showDetails ? "Hide" : "Show"} developer error details</span>
              <ChevronDown
                className={cn("size-3.5 transition-transform", showDetails && "rotate-180")}
              />
            </button>

            {showDetails && (
              <pre className="mt-3 w-full text-left p-3 rounded-xl bg-background border border-border overflow-x-auto text-[0.65rem] font-mono text-muted-foreground max-h-40 leading-normal">
                {errorDetails}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
