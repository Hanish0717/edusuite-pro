import React from "react";
import { GlassCard } from "./GlassCard";

interface InfoCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  subtitle,
  children,
  action,
  className,
}) => {
  return (
    <GlassCard className={`p-5 space-y-3 ${className}`}>
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="font-extrabold text-base text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </GlassCard>
  );
};
