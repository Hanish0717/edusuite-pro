import React from "react";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RemainingTopicItem {
  hourNumber: number;
  topic: string;
  estimatedDate: string;
  hoursRemaining: number;
}

interface RemainingTopicsProps {
  topics: RemainingTopicItem[];
}

export function RemainingTopics({ topics }: RemainingTopicsProps) {
  const totalHoursRemaining = topics.reduce((acc, curr) => acc + curr.hoursRemaining, 0);

  return (
    <Card className="p-4 sm:p-5 border-blue-500/25 bg-blue-500/5 rounded-2xl space-y-4 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-blue-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/15 text-blue-700 dark:text-blue-300">
            <Clock className="size-4" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm text-blue-800 dark:text-blue-200">
              Remaining Syllabus Topics
            </h3>
            <p className="text-[0.68rem] text-blue-700/80 dark:text-blue-300/80">
              Pending delivery schedule & timeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 text-xs font-mono">
            {topics.length} Topics Pending
          </Badge>
          <Badge className="bg-blue-600 text-white text-xs font-mono">
            {totalHoursRemaining} Hours Remaining
          </Badge>
        </div>
      </div>

      {/* Grid Layout with Auto-Fit & Min Width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {topics.map((t) => (
          <div
            key={t.hourNumber}
            className="p-4 rounded-2xl bg-card border border-blue-500/25 shadow-2xs space-y-3 flex flex-col justify-between hover:border-blue-500/40 transition-colors"
          >
            {/* Top Row: Left Hour Badge, Right Status Badge */}
            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary" className="font-mono text-xs font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                Hr {t.hourNumber < 10 ? `0${t.hourNumber}` : t.hourNumber}
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 text-[0.68rem] font-semibold">
                Upcoming
              </Badge>
            </div>

            {/* Middle: Full Topic Name (NO TRUNCATION) */}
            <div className="my-1">
              <h4 className="font-bold text-xs sm:text-sm text-foreground leading-snug break-words">
                {t.topic}
              </h4>
            </div>

            {/* Bottom Metadata */}
            <div className="pt-2 border-t border-border/50 text-[0.7rem] text-muted-foreground space-y-1 font-sans">
              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Date</span>
                <span className="font-mono font-bold text-foreground">{t.estimatedDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Duration</span>
                <span className="font-mono text-blue-600 font-bold">{t.hoursRemaining} Hour</span>
              </div>
              <div className="flex justify-between items-center pt-0.5">
                <span className="font-medium">Priority</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">High</span>
              </div>
            </div>
          </div>
        ))}

        {topics.length === 0 && (
          <div className="p-6 text-center text-xs text-muted-foreground italic col-span-full border border-dashed rounded-2xl bg-card">
            All topics completed for this subject!
          </div>
        )}
      </div>
    </Card>
  );
}
