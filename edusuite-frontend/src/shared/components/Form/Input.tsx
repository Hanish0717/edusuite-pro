import React from "react";
import { Input as BaseInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </label>
        )}
        <BaseInput
          ref={ref}
          className={cn(
            "h-9 font-semibold text-xs border-border/80 focus-visible:ring-primary/20",
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

Input.displayName = "Input";
export default Input;
