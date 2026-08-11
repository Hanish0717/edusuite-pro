import React from "react";
import { Clock, CheckCircle2, BookOpen, FileText, ExternalLink, Video, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TeachingHourItem } from "./session-planner-service";

interface TeachingHourCardsProps {
  hours: TeachingHourItem[];
}

export function TeachingHourCards({ hours }: TeachingHourCardsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
          <Clock className="size-4 text-primary" /> Hour-wise Detailed Teaching Plan ({hours.length} Hours)
        </h3>
      </div>

      <div className="space-y-3">
        {hours.map((item) => (
          <Card
            key={item.hourNumber}
            className="border-border/80 p-4 rounded-2xl bg-card shadow-sm space-y-3 hover:border-primary/30 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="font-mono text-xs bg-muted">
                  Hour {item.hourNumber}
                </Badge>
                <Badge variant="secondary" className="font-mono text-[0.68rem]">
                  Unit {item.unitNumber}
                </Badge>
                <h4 className="font-bold text-xs text-foreground">{item.topic}</h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant={
                    item.status === "Completed"
                      ? "secondary"
                      : item.status === "In Progress"
                      ? "outline"
                      : "default"
                  }
                  className={
                    item.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : item.status === "In Progress"
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  }
                >
                  {item.status}
                </Badge>
                {item.completionDate && (
                  <span className="text-[0.65rem] text-muted-foreground font-mono">
                    Done: {item.completionDate}
                  </span>
                )}
                {item.estimatedDate && (
                  <span className="text-[0.65rem] text-muted-foreground font-mono">
                    Est: {item.estimatedDate}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Learning Objectives */}
              <div className="space-y-1">
                <span className="text-[0.65rem] uppercase font-bold text-muted-foreground block">Learning Objectives</span>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground text-[0.7rem]">
                  {item.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Subtopics & Method */}
              <div className="space-y-1">
                <span className="text-[0.65rem] uppercase font-bold text-muted-foreground block">Teaching Method</span>
                <p className="font-semibold text-foreground text-[0.72rem]">{item.teachingMethod}</p>
                
                <span className="text-[0.65rem] uppercase font-bold text-muted-foreground block pt-1">Subtopics</span>
                <div className="flex flex-wrap gap-1">
                  {item.subtopics.map((st, i) => (
                    <span key={i} className="text-[0.62rem] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-1">
                <span className="text-[0.65rem] uppercase font-bold text-muted-foreground block">Teaching Resources</span>
                <div className="space-y-1">
                  {item.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.link}
                      onClick={(e) => e.preventDefault()}
                      className="flex items-center justify-between p-1.5 rounded-lg border border-border/60 hover:bg-muted/50 text-[0.68rem] text-primary font-medium transition-colors"
                    >
                      <span className="truncate">{res.title}</span>
                      <Badge variant="outline" className="text-[0.6rem] py-0 px-1 font-normal ml-1 shrink-0">
                        {res.type}
                      </Badge>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {hours.length === 0 && (
          <div className="p-8 text-center border rounded-2xl bg-muted/20 text-muted-foreground text-xs">
            No teaching hours found matching your current search or filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
