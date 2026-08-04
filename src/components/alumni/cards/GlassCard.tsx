import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gradientHover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  gradientHover = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/30 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xs transition-all duration-300",
        gradientHover && "hover:shadow-lg hover:border-blue-500/30 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
