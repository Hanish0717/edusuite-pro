import React from "react";
import { Textarea as BaseTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </label>
        )}
        <BaseTextarea
          ref={ref}
          className={cn(
            "min-h-24 font-semibold text-xs border-border/80 focus-visible:ring-primary/20",
            error && "border-red-500 focus-visible:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <span className="text-[10px] font-bold text-red-500">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
