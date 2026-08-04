import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PanelProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function Panel({
  title,
  description,
  action,
  icon: IconComp,
  children,
  className,
  contentClassName,
}: PanelProps) {
  return (
    <Card
      className={cn(
        "animate-fade-up border-border/70 shadow-card transition-shadow hover:shadow-elevated",
        className,
      )}
    >
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0 flex items-start gap-2.5">
          {IconComp && (
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
              <IconComp className="size-4" />
            </div>
          )}
          <div>
            <CardTitle className="truncate text-base">{title}</CardTitle>
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
        </div>
        {action}
      </CardHeader>
      <CardContent className={cn("pt-0", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
