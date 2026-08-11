import React from "react";
import { GraduationCap, Briefcase, Award, Calendar } from "lucide-react";
import { TimelineItem } from "@/types/alumni";
import { Badge } from "@/components/ui/badge";

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const getIcon = (type?: string) => {
    switch (type) {
      case "education":
        return <GraduationCap className="size-3.5 text-blue-600 dark:text-blue-400" />;
      case "work":
        return <Briefcase className="size-3.5 text-purple-600 dark:text-purple-400" />;
      case "award":
        return <Award className="size-3.5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Calendar className="size-3.5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
      {items.map((item) => (
        <div key={item.id} className="relative group">
          <span className="absolute -left-6 top-0.5 size-5 rounded-full bg-card border-2 border-primary grid place-items-center shadow-xs">
            {getIcon(item.iconType)}
          </span>

          <div className="space-y-1 bg-card/60 p-3 rounded-xl border border-border/60">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-extrabold text-xs text-foreground font-sans">{item.title}</h4>
              <span className="text-[0.65rem] font-mono text-muted-foreground">{item.period}</span>
            </div>
            <p className="text-[0.72rem] text-primary font-bold font-mono">{item.subtitle}</p>
            {item.description && (
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">{item.description}</p>
            )}
            {item.badge && (
              <Badge variant="outline" className="text-[0.62rem] font-mono bg-primary/10 text-primary border-primary/20">
                {item.badge}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
