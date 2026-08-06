import React from "react";
import { GlassCard } from "../cards/GlassCard";

interface LoadingSkeletonProps {
  count?: number;
  type?: "card" | "table" | "stat";
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 6,
  type = "card",
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <GlassCard key={idx} className="p-5 space-y-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-muted" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-3/4 bg-muted rounded-md" />
              <div className="h-3 w-1/2 bg-muted rounded-md" />
            </div>
          </div>
          <div className="h-16 w-full bg-muted/60 rounded-xl" />
          <div className="h-8 w-full bg-muted rounded-xl" />
        </GlassCard>
      ))}
    </div>
  );
};
