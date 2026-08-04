import { Clock, BookOpen, Users, FileText, Briefcase, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfileStats } from "@/data/faculty-mock-data";

interface StatisticsCardsProps {
  stats: ProfileStats;
}

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  const cards = [
    { label: "Teaching Experience", value: stats.experience, icon: Clock, color: "bg-blue-500/10 text-blue-600 border-blue-500/10" },
    { label: "Subjects Handled", value: `${stats.subjectsHandled} Subjects`, icon: BookOpen, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" },
    { label: "Students Mentored", value: `${stats.studentsMentored} Mentees`, icon: Users, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/10" },
    { label: "Total Publications", value: `${stats.publications} Papers`, icon: FileText, color: "bg-violet-500/10 text-violet-600 border-violet-500/10" },
    { label: "Projects Guided", value: `${stats.projectsGuided} Projects`, icon: GraduationCap, color: "bg-amber-500/10 text-amber-600 border-amber-500/10" },
    { label: "Workshops Led", value: `${stats.workshopsConducted} Events`, icon: Briefcase, color: "bg-teal-500/10 text-teal-600 border-teal-500/10" },
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
