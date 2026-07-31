import type { LucideIcon } from "lucide-react";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModulePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tabs: string[];
  highlights: { label: string; value: string }[];
  onActionClick?: () => void;
  actionText?: string;
}

export function ModulePage({
  title,
  description,
  icon: Icon,
  tabs,
  highlights,
  onActionClick,
  actionText = "New record",
}: ModulePageProps) {
  return (
    <div className="space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-primary-foreground">
            <Icon className="size-6" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-extrabold sm:text-2xl">{title}</h1>
            <p className="truncate text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {onActionClick && (
          <Button
            onClick={onActionClick}
            className="shrink-0 bg-brand-gradient shadow-glow cursor-pointer"
          >
            {actionText}
          </Button>
        )}
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="animate-fade-up rounded-2xl border border-border/70 bg-card p-5 shadow-card"
          >
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-2 font-display text-2xl font-extrabold">{item.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue={tabs[0] ?? "overview"}>
        <TabsList className="flex-wrap">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <Panel
              title={tab}
              description="This module screen is wired to the shared layout and design system, ready for API integration."
              action={<Badge variant="secondary">Phase 2</Badge>}
            >
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-4/5" />
                <Skeleton className="h-10 w-3/5" />
              </div>
            </Panel>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
