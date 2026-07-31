import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number; // 0-indexed
  onStepClick?: (index: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <div className={cn("w-full flex items-center justify-between", className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;
        const isPending = idx > currentStep;
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={idx}>
            {/* Step Node */}
            <div
              className={cn(
                "flex items-center gap-3 select-none",
                onStepClick && idx <= currentStep && "cursor-pointer group",
              )}
              onClick={() => onStepClick && idx <= currentStep && onStepClick(idx)}
            >
              <div
                className={cn(
                  "size-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-all duration-300",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground shadow-sm"
                    : isActive
                      ? "border-primary text-primary bg-primary/5 ring-4 ring-primary/10 shadow-glow"
                      : "border-muted text-muted-foreground bg-background",
                  onStepClick && idx <= currentStep && "group-hover:scale-105",
                )}
              >
                {isCompleted ? <Check className="size-4 stroke-[3]" /> : <span>{idx + 1}</span>}
              </div>
              <div className="hidden sm:block text-left">
                <p
                  className={cn(
                    "text-xs font-bold leading-none transition-colors duration-300",
                    isActive
                      ? "text-primary"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-[0.65rem] text-muted-foreground mt-0.5 max-w-[120px] truncate">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connecting Line */}
            {!isLast && (
              <div className="flex-1 h-0.5 mx-4 min-w-[30px] rounded-full overflow-hidden bg-muted">
                <div
                  className={cn(
                    "h-full bg-primary transition-all duration-500",
                    isCompleted ? "w-full" : "w-0",
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
