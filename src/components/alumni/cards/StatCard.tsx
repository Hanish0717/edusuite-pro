import React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = "increase",
  icon: Icon,
  iconBgColor = "bg-[#4D78FF]/10",
  iconTextColor = "text-[#2563EB] dark:text-[#4D78FF]",
  description,
  className,
}) => {
  return (
    <GlassCard className={cn("p-4 flex flex-col justify-between space-y-2 border border-slate-200 dark:border-[#24356B]", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[0.68rem] font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className={cn("size-9 rounded-xl grid place-items-center font-bold", iconBgColor, iconTextColor)}>
          <Icon className="size-4 text-current" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-2xl font-extrabold text-foreground tracking-tight font-display">
            {value}
          </p>
          {change && (
            <span
              className={cn(
                "text-[0.68rem] font-extrabold px-2 py-0.5 rounded-full font-mono bg-[#4D78FF]/10 text-[#2563EB] dark:text-[#4D78FF]"
              )}
            >
              {change}
            </span>
          )}
        </div>
        {description && (
          <p className="text-[0.72rem] text-muted-foreground leading-snug">{description}</p>
        )}
      </div>
    </GlassCard>
  );
};
