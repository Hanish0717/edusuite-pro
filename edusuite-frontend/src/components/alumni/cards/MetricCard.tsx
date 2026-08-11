import React from "react";
import { GlassCard } from "./GlassCard";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  colorClass?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  colorClass = "text-blue-600 dark:text-blue-400",
}) => {
  return (
    <GlassCard className="p-3.5 space-y-1">
      <span className="text-[0.68rem] font-bold text-muted-foreground block uppercase tracking-wider">
        {label}
      </span>
      <p className={`font-display text-xl font-extrabold ${colorClass}`}>{value}</p>
      {subtext && <p className="text-[0.65rem] text-muted-foreground">{subtext}</p>}
    </GlassCard>
  );
};
