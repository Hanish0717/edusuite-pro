import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  scope?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, scope, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5 mb-6">
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary text-white shadow-[0_0_15px_rgba(29,78,216,0.35)] shrink-0">
          <Icon className="size-6" />
        </span>
        <div>
          <h1 className="font-display text-xl font-extrabold sm:text-2xl text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 self-start sm:self-auto">
        {scope && (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-mono py-1 px-3 font-semibold">
            Scope: {scope}
          </Badge>
        )}
        {actions}
      </div>
    </header>
  );
}
