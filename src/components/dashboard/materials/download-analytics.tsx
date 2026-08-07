import React from "react";
import { Download, TrendingUp, AlertCircle, ArrowUpRight, BarChart3, Calendar, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GroupedBarChart } from "@/components/dashboard/charts";
import type { StudyMaterialItem } from "@/data/faculty-mock-data";

interface DownloadAnalyticsProps {
  materials?: StudyMaterialItem[];
}

export function DownloadAnalytics({ materials = [] }: DownloadAnalyticsProps) {
  const downloadsToday = 48;
  const downloadsThisWeek = 342;

  const sortedMaterials = [...materials].sort((a, b) => b.downloadCount - a.downloadCount);
  const mostDownloaded = sortedMaterials[0]?.title || "Operating Systems CPU Scheduling Notes";
  const leastAccessed = sortedMaterials[sortedMaterials.length - 1]?.title || "Memory Management Lab Draft";

  const chartData = [
    { name: "Mon", downloads: 42, views: 95 },
    { name: "Tue", downloads: 68, views: 140 },
    { name: "Wed", downloads: 85, views: 190 },
    { name: "Thu", downloads: 92, views: 210 },
    { name: "Fri", downloads: 55, views: 125 },
  ];

  return (
    <Card className="p-4 sm:p-5 border-border/80 rounded-2xl bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <BarChart3 className="size-4" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm text-foreground">
              Material Access & Download Analytics
            </h3>
            <p className="text-[0.68rem] text-muted-foreground">
              Student engagement curves and consumption metrics
            </p>
          </div>
        </div>

        <Badge variant="outline" className="font-mono text-xs">
          Realtime LMS Analytics
        </Badge>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[0.65rem] font-bold uppercase">Downloads Today</span>
            <Calendar className="size-3.5 text-emerald-600" />
          </div>
          <p className="font-mono text-xl font-extrabold text-emerald-600">{downloadsToday}</p>
          <p className="text-[0.62rem] text-emerald-600 font-medium">+18% vs yesterday</p>
        </div>

        <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-1">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[0.65rem] font-bold uppercase">Downloads This Week</span>
            <TrendingUp className="size-3.5 text-blue-600" />
          </div>
          <p className="font-mono text-xl font-extrabold text-blue-600">{downloadsThisWeek}</p>
          <p className="text-[0.62rem] text-blue-600 font-medium">+24% weekly growth</p>
        </div>

        <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-1">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[0.65rem] font-bold uppercase">Most Downloaded</span>
            <Sparkles className="size-3.5 text-indigo-600" />
          </div>
          <p className="font-bold text-xs text-foreground truncate" title={mostDownloaded}>
            {mostDownloaded}
          </p>
          <p className="text-[0.62rem] text-indigo-600 font-medium">184 Downloads</p>
        </div>

        <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[0.65rem] font-bold uppercase">Least Accessed</span>
            <AlertCircle className="size-3.5 text-amber-600" />
          </div>
          <p className="font-bold text-xs text-foreground truncate" title={leastAccessed}>
            {leastAccessed}
          </p>
          <p className="text-[0.62rem] text-amber-600 font-medium">Draft / Pending</p>
        </div>
      </div>

      {/* Mock Chart */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Daily Download Hits & Student Views
        </h4>
        <GroupedBarChart
          data={chartData}
          xKey="name"
          series={[
            { key: "downloads", label: "Downloads" },
            { key: "views", label: "Page Views" },
          ]}
          height={180}
        />
      </div>
    </Card>
  );
}

