import React from "react";
import { BookOpen, FileText, Video, Link, Download, ExternalLink, HelpCircle, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SessionPlannerResource } from "./session-planner-service";

interface ResourcesPanelProps {
  resources: SessionPlannerResource[];
}

const RESOURCE_ICONS = {
  PPT: FileText,
  "Lab Manual": BookOpen,
  "Reference Book": GraduationCap,
  Video: Video,
  "Question Bank": HelpCircle,
  "NPTEL Link": Link
};

export function ResourcesPanel({ resources }: ResourcesPanelProps) {
  return (
    <Card className="p-4 border-border/80 rounded-2xl bg-card shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
          <BookOpen className="size-4 text-primary" /> Central Course & Teaching Resources ({resources.length})
        </h3>
        <Badge variant="outline" className="font-mono text-xs">
          Open Access Repository
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {resources.map((res, i) => {
          const Icon = RESOURCE_ICONS[res.type] || FileText;
          return (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30 transition-all text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <h5 className="font-bold text-foreground truncate" title={res.title}>
                    {res.title}
                  </h5>
                  <span className="text-[0.65rem] text-muted-foreground font-mono">{res.type}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-lg shrink-0 cursor-pointer text-muted-foreground hover:text-primary"
                onClick={() => window.open(res.link, "_blank")}
              >
                <ExternalLink className="size-3.5" />
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
