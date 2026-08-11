import { useMemo } from "react";
import { toast } from "sonner";
import { Library, BookOpen, Clock, Globe, Plus, Download } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { fetchLibrarianStats, fetchLibraryCirculation } from "@/lib/roleDashboardService";

export function LibrarianDashboard() {
  const stats = useMemo(() => fetchLibrarianStats(), []);
  const items = useMemo(() => fetchLibraryCirculation(), []);

  const renderIcon = (name: string) => {
    switch (name) {
      case "Library":
        return Library;
      case "BookOpen":
        return BookOpen;
      case "Clock":
        return Clock;
      default:
        return Globe;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Library Management Console
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Book Cataloging, Circulation Logs, E-Journal Subscriptions, Fines.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          LIBRARIAN
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((kpi, idx) => {
          const IconComp = renderIcon(kpi.iconName);
          return (
            <KpiCard
              key={idx}
              label={kpi.label}
              value={kpi.value}
              icon={IconComp}
              tone={kpi.tone}
            />
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Recent Book Circulation & Returns">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.meta}</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Library Quick Actions">
            <div className="space-y-2">
              <Button
                onClick={() => toast.info("Opening accession catalog form...")}
                className="w-full justify-start bg-brand-gradient text-xs cursor-pointer"
              >
                <Plus className="size-4 mr-2" /> Add Book to Catalog
              </Button>
              <Button
                onClick={() => toast.success("Generating overdue fines report...")}
                variant="outline"
                className="w-full justify-start text-xs cursor-pointer"
              >
                <Download className="size-4 mr-2" /> Export Circulation Log
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
