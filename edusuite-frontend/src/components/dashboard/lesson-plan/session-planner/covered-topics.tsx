import React from "react";
import { CheckCircle2, Clock, Calendar, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CoveredTopicItem {
  hourNumber: number;
  topic: string;
  completionDate: string;
  hoursUsed: number;
}

interface CoveredTopicsProps {
  topics: CoveredTopicItem[];
}

export function CoveredTopics({ topics }: CoveredTopicsProps) {
  const totalHoursUsed = topics.reduce((acc, curr) => acc + curr.hoursUsed, 0);

  return (
    <Card className="p-4 sm:p-5 border-emerald-500/25 bg-emerald-500/5 rounded-2xl space-y-4 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-emerald-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm text-emerald-800 dark:text-emerald-200">
              Covered Syllabus Topics
            </h3>
            <p className="text-[0.68rem] text-emerald-700/80 dark:text-emerald-300/80">
              Verified completed teaching sessions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs font-mono">
            {topics.length} Topics Completed
          </Badge>
          <Badge className="bg-emerald-600 text-white text-xs font-mono">
            {totalHoursUsed} Hours Used
          </Badge>
        </div>
      </div>

      {/* Grid Layout with Auto-Fit & Min Width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {topics.map((t) => (
          <div
            key={t.hourNumber}
            className="p-4 rounded-2xl bg-card border border-emerald-500/25 shadow-2xs space-y-3 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
          >
            {/* Top Row: Left Hour Badge, Right Status Badge */}
            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary" className="font-mono text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                Hr {t.hourNumber < 10 ? `0${t.hourNumber}` : t.hourNumber}
              </Badge>
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[0.68rem] font-semibold flex items-center gap-1">
                <Check className="size-3" /> Completed
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
                <span className="font-medium">Completion Date</span>
                <span className="font-mono font-bold text-foreground">{t.completionDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium font-sans">Duration Used</span>
                <span className="font-mono text-emerald-600 font-bold">{t.hoursUsed} Hour</span>
              </div>
            </div>
          </div>
        ))}

        {topics.length === 0 && (
          <div className="p-6 text-center text-xs text-muted-foreground italic col-span-full border border-dashed rounded-2xl bg-card">
            No completed syllabus topics recorded yet.
          </div>
        )}
      </div>
    </Card>
  );
}
