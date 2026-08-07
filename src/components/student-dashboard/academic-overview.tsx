import React from "react";
import { AcademicOverview } from "./types";
import {
  CheckCircle2,
  CreditCard,
  Library,
  FileSpreadsheet,
  FileCheck,
  GraduationCap
} from "lucide-react";

interface AcademicOverviewCardsProps {
  data: AcademicOverview;
}

export const AcademicOverviewCards: React.FC<AcademicOverviewCardsProps> = ({ data }) => {
  const cards = [
    {
      title: "Overall Attendance",
      value: `${data.attendancePercentage}%`,
      subtitle: data.attendancePercentage >= 75 ? "Safe Eligible Status" : "Shortage Warning",
      badgeType: data.attendancePercentage >= 75 ? "positive" : "negative",
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Current Semester",
      value: data.currentSemester,
      subtitle: "B.Tech CSE - Autumn 2026",
      badgeType: "neutral",
      icon: GraduationCap,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20"
    },
    {
      title: "Pending Fees",
      value: `₹${data.pendingFees.toLocaleString()}`,
      subtitle: "Due by Aug 20, 2026",
      badgeType: data.pendingFees > 0 ? "warning" : "positive",
      icon: CreditCard,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20"
    },
    {
      title: "Library Books",
      value: `${data.issuedBooksCount} Issued`,
      subtitle: "0 Overdue Books",
      badgeType: "neutral",
      icon: Library,
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20"
    },
    {
      title: "Upcoming Exams",
      value: `${data.upcomingExamsCount} Exams`,
      subtitle: "Mid-Sem starts Aug 18",
      badgeType: "warning",
      icon: FileSpreadsheet,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Pending Assignments",
      value: `${data.pendingAssignmentsCount} Pending`,
      subtitle: "Nearest due tomorrow",
      badgeType: "warning",
      icon: FileCheck,
      color: "text-orange-500 bg-orange-500/10 border-orange-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group relative rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border ${card.color} transition-transform group-hover:scale-110`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-xl font-bold text-foreground">{card.value}</div>
              <p className="text-[11px] text-muted-foreground">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
