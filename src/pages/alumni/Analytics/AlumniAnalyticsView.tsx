import React from "react";
import { toast } from "sonner";
import { BarChart3, Download, Globe, Building2, Heart, Award } from "lucide-react";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import {
  AlumniGrowthAreaChart,
  IndustryDonutChart,
  PlacementBarChart,
  DonationTrendLineChart,
} from "@/components/alumni/charts/AlumniCharts";
import { PlacementStatsWidget } from "@/components/alumni/statistics/PlacementStatsWidget";
import { GlassCard } from "@/components/alumni/cards/GlassCard";
import { Button } from "@/components/ui/button";

export const AlumniAnalyticsView: React.FC = () => {
  const handleExportAnalyticsReport = () => {
    toast.success("Generating Enterprise Alumni Analytics & Placement Report (PDF)...", {
      description: "Includes placement package distributions, geographic footprint, and endowment reports.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alumni Analytics & Executive Reports"
        subtitle="Deep data insights into global alumni footprint, career placement packages, industry distribution, and endowment statistics."
        badgeText="Real-Time Analytics Suite"
        icon={BarChart3}
        actions={
          <Button
            onClick={handleExportAnalyticsReport}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md gap-1.5"
          >
            <Download className="size-3.5" /> Export Analytics Report (PDF)
          </Button>
        }
      />

      {/* PLACEMENT HIGHLIGHTS WIDGET */}
      <PlacementStatsWidget />

      {/* PRIMARY CHARTS GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AlumniGrowthAreaChart />
        <PlacementBarChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <IndustryDonutChart />
        <DonationTrendLineChart />
      </div>

      {/* GEOGRAPHIC FOOTPRINT */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Globe className="size-5 text-blue-600" /> Geographic Footprint &amp; Global Chapters
            </h3>
            <p className="text-xs text-muted-foreground">Distribution of 5,420 alumni across international hubs</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
          {[
            { region: "India (Bengaluru, Hyd, NCR)", count: "3,360 Alumni", pct: "62%", color: "bg-blue-600" },
            { region: "United States (Bay Area, Austin)", count: "1,190 Alumni", pct: "22%", color: "bg-purple-600" },
            { region: "United Kingdom & Europe", count: "430 Alumni", pct: "8%", color: "bg-emerald-600" },
            { region: "Singapore & East Asia", count: "270 Alumni", pct: "5%", color: "bg-amber-600" },
          ].map((g) => (
            <div key={g.region} className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2">
              <span className="font-sans font-bold text-foreground block text-[0.75rem]">{g.region}</span>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-foreground text-sm">{g.pct}</span>
                <span className="text-[0.65rem] text-muted-foreground">{g.count}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${g.color} rounded-full`} style={{ width: g.pct }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
