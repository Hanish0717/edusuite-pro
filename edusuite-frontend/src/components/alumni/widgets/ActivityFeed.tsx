import React from "react";
import { Sparkles, Briefcase, Award, Heart, Calendar } from "lucide-react";
import { ActivityItem } from "@/types/alumni";
import { GlassCard } from "../cards/GlassCard";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "job":
        return <Briefcase className="size-3.5 text-[#2563EB]" />;
      case "mentorship":
        return <Award className="size-3.5 text-[#4D78FF]" />;
      case "donation":
        return <Heart className="size-3.5 text-[#2563EB] fill-[#2563EB]" />;
      case "event":
        return <Calendar className="size-3.5 text-[#3B82F6]" />;
      default:
        return <Sparkles className="size-3.5 text-[#4D78FF]" />;
    }
  };

  return (
    <GlassCard className="p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
          <Sparkles className="size-4 text-[#2563EB]" /> Live Activity Feed
        </h3>
        <span className="text-[0.65rem] font-mono text-muted-foreground">Real-time updates</span>
      </div>

      <div className="space-y-3">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start gap-3 text-xs font-mono p-2.5 rounded-xl bg-card border border-[#24356B]/20">
            <span className="size-8 rounded-xl bg-[#4D78FF]/10 border border-[#24356B]/30 grid place-items-center shrink-0">
              {getIcon(act.type)}
            </span>
            <div className="space-y-0.5 flex-1 min-w-0">
              <p className="text-muted-foreground font-sans leading-relaxed text-[0.75rem]">
                <strong className="text-foreground">{act.user}</strong> {act.action}{" "}
                <strong className="text-[#2563EB] dark:text-[#4D78FF]">{act.target}</strong>
              </p>
              <span className="text-[0.65rem] text-muted-foreground block">{act.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
