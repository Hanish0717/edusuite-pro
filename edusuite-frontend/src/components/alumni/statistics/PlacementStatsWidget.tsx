import React from "react";
import { TrendingUp } from "lucide-react";
import { GlassCard } from "../cards/GlassCard";

export const PlacementStatsWidget: React.FC = () => {
  return (
    <GlassCard className="p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
            <TrendingUp className="size-5 text-[#2563EB]" /> Executive Placement Highlights
          </h3>
          <p className="text-xs text-muted-foreground">Historical campus recruitment trends (2021–2025)</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-3.5 bg-[#4D78FF]/10 dark:bg-[#1A285D]/40 rounded-2xl border border-[#24356B]/40 space-y-1">
          <span className="text-[0.65rem] font-bold text-[#2563EB] dark:text-[#4D78FF] uppercase font-mono block">
            Placement Rate
          </span>
          <p className="text-xl font-extrabold text-[#2563EB] dark:text-[#4D78FF] font-display">96.4%</p>
          <span className="text-[0.65rem] text-muted-foreground font-mono">1,840 Total Offers (2025)</span>
        </div>

        <div className="p-3.5 bg-[#4D78FF]/10 dark:bg-[#1A285D]/40 rounded-2xl border border-[#24356B]/40 space-y-1">
          <span className="text-[0.65rem] font-bold text-[#2563EB] dark:text-[#4D78FF] uppercase font-mono block">
            Highest International CTC
          </span>
          <p className="text-xl font-extrabold text-[#2563EB] dark:text-[#4D78FF] font-display">₹72.0 LPA</p>
          <span className="text-[0.65rem] text-muted-foreground font-mono">Google US / Stanford Lab</span>
        </div>

        <div className="p-3.5 bg-[#4D78FF]/10 dark:bg-[#1A285D]/40 rounded-2xl border border-[#24356B]/40 space-y-1">
          <span className="text-[0.65rem] font-bold text-[#2563EB] dark:text-[#4D78FF] uppercase font-mono block">
            Average Domestic CTC
          </span>
          <p className="text-xl font-extrabold text-[#2563EB] dark:text-[#4D78FF] font-display">₹16.4 LPA</p>
          <span className="text-[0.65rem] text-muted-foreground font-mono">+12.5% YoY Growth</span>
        </div>

        <div className="p-3.5 bg-[#4D78FF]/10 dark:bg-[#1A285D]/40 rounded-2xl border border-[#24356B]/40 space-y-1">
          <span className="text-[0.65rem] font-bold text-[#2563EB] dark:text-[#4D78FF] uppercase font-mono block">
            Partner Recruiters
          </span>
          <p className="text-xl font-extrabold text-[#2563EB] dark:text-[#4D78FF] font-display">240+ Companies</p>
          <span className="text-[0.65rem] text-muted-foreground font-mono">Fortune 500 &amp; AI Unicorns</span>
        </div>
      </div>
    </GlassCard>
  );
};
