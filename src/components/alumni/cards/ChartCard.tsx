import React from "react";
import { GlassCard } from "./GlassCard";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  headerAction,
}) => {
  return (
    <GlassCard className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
      <div className="w-full">{children}</div>
    </GlassCard>
  );
};
