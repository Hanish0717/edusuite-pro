import { FileText, ClipboardList, CheckCircle, AlertTriangle, Percent, MailOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AttendanceModuleData } from "@/data/faculty-mock-data";

interface StatisticsCardsProps {
  attendanceData: AttendanceModuleData;
}

export function StatisticsCards({ attendanceData }: StatisticsCardsProps) {
  const { stats } = attendanceData;

  const cards = [
    { label: "Classes Conducted", value: `${stats.conducted} sessions`, icon: FileText, color: "bg-blue-500/10 text-blue-600 border-blue-500/10" },
    { label: "Attendance Pending", value: `${stats.pending} periods`, icon: ClipboardList, color: "bg-amber-500/10 text-amber-600 border-amber-500/10" },
    { label: "Present Today", value: `${stats.presentToday} Students`, icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10" },
    { label: "Absent Today", value: `${stats.absentToday} Students`, icon: AlertTriangle, color: "bg-rose-500/10 text-rose-600 border-rose-500/10" },
    { label: "Average Attendance", value: `${stats.average}% Rate`, icon: Percent, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/10" },
    { label: "Leave Pending", value: `${stats.leavesPending} requests`, icon: MailOpen, color: "bg-violet-500/10 text-violet-600 border-violet-500/10" },
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
