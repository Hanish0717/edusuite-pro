import { BookOpen, Layers, Users, Clock, FileText, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SubjectItem } from "@/data/faculty-mock-data";

interface StatisticsCardsProps {
  subjects: SubjectItem[];
}

export function StatisticsCards({ subjects }: StatisticsCardsProps) {
  const totalAssigned = subjects.length;
  const theoryCount = subjects.filter((s) => s.type === "Theory").length;
  const labCount = subjects.filter((s) => s.type === "Lab").length;
  
  const weeklyHours = subjects.reduce((sum, s) => sum + s.weeklyHours, 0);
  
  // Calculate unique sections
  const sections = Array.from(new Set(subjects.flatMap((s) => s.assignedSections)));
  const totalSections = sections.length;
  
  const totalStudents = subjects.reduce((sum, s) => sum + s.studentsCount, 0);

  const cards = [
    { label: "Assigned Subjects", value: `${totalAssigned} Subjects`, icon: BookOpen, color: "bg-blue-500/10 text-blue-600 border-blue-500/10" },
    { label: "Theory Courses", value: `${theoryCount} Theory`, icon: FileText, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/10" },
    { label: "Laboratory Practice", value: `${labCount} Lab`, icon: Award, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" },
    { label: "Weekly Workload", value: `${weeklyHours} Hours`, icon: Clock, color: "bg-violet-500/10 text-violet-600 border-violet-500/10" },
    { label: "Assigned Sections", value: `${totalSections} Sections`, icon: Layers, color: "bg-amber-500/10 text-amber-600 border-amber-500/10" },
    { label: "Academic Strength", value: `${totalStudents} Students`, icon: Users, color: "bg-teal-500/10 text-teal-600 border-teal-500/10" },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-xs">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className="border border-border/70 py-0 shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1"
        >
          <CardContent className="flex flex-col items-center text-center p-4">
            <span className={`grid size-9 place-items-center rounded-xl border mb-2.5 ${card.color}`}>
              <card.icon className="size-4.5" />
            </span>
            <p className="font-extrabold text-muted-foreground uppercase tracking-wider text-[0.55rem]">
              {card.label}
            </p>
            <p className="mt-1 text-base font-black tracking-tight text-foreground">
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
