import { FileText, Award, Layers, Users, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SubjectItem } from "@/data/faculty-mock-data";

interface SubjectCardProps {
  subject: SubjectItem;
  onClick: () => void;
}

export function SubjectCard({ subject, onClick }: SubjectCardProps) {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "Lab":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
    }
  };

  return (
    <Card
      onClick={onClick}
      className="border border-border/70 py-0 shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden cursor-pointer group"
    >
      <div className="absolute right-0 top-0 h-16 w-16 bg-muted/10 blur-xl" />
      <CardContent className="p-5 space-y-4 text-xs">
        <div className="flex justify-between items-start">
          <span className="font-mono text-muted-foreground text-[0.65rem] font-bold">
            {subject.code} &middot; Sem {subject.semester}
          </span>
          <div className="flex gap-1.5 shrink-0">
            <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.6rem] font-bold border ${getTypeStyle(subject.type)}`}>
              {subject.type}
            </Badge>
            <Badge variant="outline" className={`py-0 px-2 rounded-xl text-[0.6rem] font-bold border ${getBadgeStyle(subject.status)}`}>
              {subject.status}
            </Badge>
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-sm leading-snug group-hover:text-primary transition-colors truncate">
            {subject.name}
          </h4>
          <p className="text-[0.65rem] text-muted-foreground mt-0.5 font-bold">
            Regulation: {subject.regulation} &middot; {subject.credits} Credits
          </p>
        </div>

        {/* Dynamic workload and strengths */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/40 text-[0.65rem] text-muted-foreground font-medium">
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-0.5 text-foreground"><Clock className="size-3 text-primary/60" /> {subject.weeklyHours}h</span>
            <span className="text-[0.55rem] opacity-75 font-semibold mt-0.5 uppercase tracking-wider text-muted-foreground/80">Weekly</span>
          </div>
          <div className="flex flex-col items-center border-x border-border/50">
            <span className="flex items-center gap-0.5 text-foreground"><Layers className="size-3 text-primary/60" /> {subject.assignedSections.join(", ")}</span>
            <span className="text-[0.55rem] opacity-75 font-semibold mt-0.5 uppercase tracking-wider text-muted-foreground/80">Sections</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-0.5 text-foreground"><Users className="size-3 text-primary/60" /> {subject.studentsCount}</span>
            <span className="text-[0.55rem] opacity-75 font-semibold mt-0.5 uppercase tracking-wider text-muted-foreground/80">Students</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
