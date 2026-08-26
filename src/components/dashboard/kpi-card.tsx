import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: string;
  trend?: "up" | "down";
  tone?: "primary" | "success" | "warning" | "info" | "destructive" | "purple";
  className?: string;
  onClick?: () => void;
}

const toneMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/10 text-info",
  destructive: "bg-destructive/10 text-destructive",
  purple: "bg-purple-500/10 text-purple-600",
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  trend = "up",
  tone = "primary",
  className,
  onClick,
}: KpiCardProps) {
  return (
    <Card onClick={onClick} className={cn("animate-fade-up gap-0 border-border/70 py-0 shadow-card transition-shadow hover:shadow-elevated h-full", onClick && "cursor-pointer", className)}>
      <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5 h-full">
        <div className="min-w-0 flex-1 flex flex-col justify-between h-full">
          <p className="text-xs sm:text-sm font-semibold text-muted-foreground leading-snug break-words" title={label}>{label}</p>
          <p className="mt-2 font-display text-2xl font-extrabold tracking-tight whitespace-nowrap">{value}</p>
          {delta && (
            <p
              className={cn(
                "mt-1.5 flex items-center gap-1 text-xs font-medium",
                trend === "up" ? "text-success" : "text-destructive",
              )}
            >
              {trend === "up" ? (
                <TrendingUp className="size-3.5" />
              ) : (
                <TrendingDown className="size-3.5" />
              )}
              {delta}
            </p>
          )}
        </div>
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", toneMap[tone])}>
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}
