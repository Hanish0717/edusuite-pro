import { Users, UserCheck, ShieldAlert, FileText, Percent, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { StudentDetails } from "@/data/faculty-mock-data";

interface StatisticsCardsProps {
  students: StudentDetails[];
}

export function StatisticsCards({ students }: StatisticsCardsProps) {
  const total = students.length;
  const active = students.filter((s) => s.status === "Active").length;
  const shortage = students.filter((s) => s.attendance.percentage < 75).length;
  const lowGrades = students.filter((s) => s.performance.internalMarks < 70).length;
  
  const avgAttendance = total > 0
    ? Math.round(students.reduce((sum, s) => sum + s.attendance.percentage, 0) / total)
    : 0;
    
  const avgGpa = total > 0
    ? Math.round(students.reduce((sum, s) => sum + s.performance.internalMarks, 0) / total)
    : 0;

  const cards = [
    { label: "Assigned Students", value: `${total} Students`, icon: Users, color: "bg-blue-500/10 text-blue-600 border-blue-500/10" },
    { label: "Active Roster", value: `${active} Active`, icon: UserCheck, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" },
    { label: "Attendance Alerts", value: `${shortage} short`, icon: ShieldAlert, color: "bg-rose-500/10 text-rose-600 border-rose-500/10" },
    { label: "Grades Alerts", value: `${lowGrades} at risk`, icon: FileText, color: "bg-amber-500/10 text-amber-600 border-amber-500/10" },
    { label: "Average Attendance", value: `${avgAttendance}% index`, icon: Percent, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/10" },
    { label: "Average GPA Index", value: `${avgGpa}% score`, icon: Award, color: "bg-violet-500/10 text-violet-600 border-violet-500/10" },
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
