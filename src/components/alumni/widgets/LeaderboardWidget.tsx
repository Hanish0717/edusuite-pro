import React from "react";
import { Crown } from "lucide-react";
import { TopContributorItem } from "@/types/alumni";
import { GlassCard } from "../cards/GlassCard";
import { Badge } from "@/components/ui/badge";

interface LeaderboardWidgetProps {
  contributors: TopContributorItem[];
}

export const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({ contributors }) => {
  return (
    <GlassCard className="p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
          <Crown className="size-5 text-[#4D78FF]" /> Endowment Honor Roll
        </h3>
        <Badge variant="outline" className="text-[0.65rem] font-mono bg-[#4D78FF]/10 text-[#2563EB] dark:text-[#4D78FF] border-[#24356B]/40">
          Top Contributors
        </Badge>
      </div>

      <div className="space-y-3">
        {contributors.map((c, idx) => (
          <div
            key={c.id}
            className="flex items-center justify-between p-3 rounded-2xl bg-card border border-[#24356B]/30 hover:border-[#4D78FF]/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={c.avatar} alt={c.name} className="size-11 rounded-2xl object-cover border border-[#4D78FF]/30 shadow-xs" />
                <span className="absolute -top-1.5 -left-1.5 size-5 rounded-full bg-[#2563EB] text-white font-extrabold text-[0.65rem] font-mono grid place-items-center shadow-xs">
                  #{idx + 1}
                </span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-xs text-foreground font-sans">{c.name}</h4>
                <p className="text-[0.68rem] text-muted-foreground font-mono">{c.company} • {c.batch}</p>
                <span className="text-[0.62rem] text-[#2563EB] dark:text-[#4D78FF] font-bold block">{c.tier}</span>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs font-extrabold text-[#2563EB] dark:text-[#4D78FF] block">
                ₹{(c.totalDonated / 100000).toFixed(2)} Lakh
              </span>
              <span className="text-[0.62rem] text-muted-foreground">Total Endowment</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
