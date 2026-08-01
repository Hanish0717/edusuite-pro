import React from "react";
import { Download, Calendar, BookOpen, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const QuickActions: React.FC = () => {
  const actions = [
    { title: "Download Academic Calendar", icon: Calendar, action: () => alert("Downloading Academic Calendar 2026-27...") },
    { title: "Download Holiday List", icon: Download, action: () => alert("Downloading Official Holiday List...") },
    { title: "Download Exam Schedule", icon: FileText, action: () => alert("Downloading Mid-Sem Exam Schedule...") },
    { title: "View Timetable", icon: Clock, action: () => alert("Opening Student Timetable...") },
    { title: "Open Student Handbook", icon: BookOpen, action: () => alert("Opening Student Code of Conduct Handbook...") }
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <FileText className="h-3.5 w-3.5 text-primary" /> Quick Downloads & Actions
      </h3>
      <div className="space-y-1.5">
        {actions.map((act, index) => {
          const Icon = act.icon;
          return (
            <button
              key={index}
              onClick={act.action}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 hover:bg-primary/10 hover:border-primary/40 text-xs font-medium text-foreground transition-all group text-left"
            >
              <span className="flex items-center gap-2 line-clamp-1">
                <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                {act.title}
              </span>
              <Download className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
