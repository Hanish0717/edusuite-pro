import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  TrendingUp,
  IndianRupee,
  CheckCircle2,
  BookOpen,
  Library,
  FileSpreadsheet,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface KpiCardsProps {
  onNavigate: (route: string) => void;
}

export function StudentKpiCards({ onNavigate }: KpiCardsProps) {
  const cards = [
    {
      id: "attendance",
      label: "Overall Attendance",
      value: "88.5%",
      subValue: "137 / 155 Classes",
      icon: CalendarCheck,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      statusLabel: "Eligible (85%+)",
      statusVariant: "success",
      trendText: "+2.1% this month",
      trendDir: "up",
      route: "/student/attendance",
    },
    {
      id: "sgpa",
      label: "Current SGPA",
      value: "8.60",
      subValue: "Semester VII Target",
      icon: TrendingUp,
      iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      statusLabel: "Semester VII",
      statusVariant: "info",
      trendText: "Consistent A Grade",
      trendDir: "up",
      route: "/student/examinations",
    },
    {
      id: "fees",
      label: "Fee Due",
      value: "₹0",
      subValue: "Sem VII Tuition & Mess",
      icon: IndianRupee,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      statusLabel: "Fully Paid",
      statusVariant: "success",
      trendText: "Next invoice: Nov 1",
      trendDir: "neutral",
      route: "/student/finance",
    },
    {
      id: "backlogs",
      label: "Backlogs",
      value: "0",
      subValue: "Clear Academic Record",
      icon: CheckCircle2,
      iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      statusLabel: "Clear Record",
      statusVariant: "success",
      trendText: "No active arrears",
      trendDir: "neutral",
      route: "/student/examinations",
    },
    {
      id: "courses",
      label: "Registered Courses",
      value: "6 Courses",
      subValue: "Semester VII Curriculum",
      icon: BookOpen,
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      statusLabel: "Enrolled",
      statusVariant: "info",
      trendText: "24 credits total",
      trendDir: "neutral",
      route: "/student/lms",
    },
    {
      id: "library",
      label: "Library Books Issued",
      value: "3 Books",
      subValue: "0 Overdue Books",
      icon: Library,
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      statusLabel: "Normal Return",
      statusVariant: "warning",
      trendText: "Due on Aug 12",
      trendDir: "neutral",
      route: "/student/library",
    },
    {
      id: "exams",
      label: "Upcoming Exams",
      value: "3 Scheduled",
      subValue: "End-Sem Time Table Live",
      icon: FileSpreadsheet,
      iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      statusLabel: "Starts Aug 08",
      statusVariant: "danger",
      trendText: "Hall Ticket Ready",
      trendDir: "neutral",
      route: "/student/examinations",
    },
    {
      id: "assignments",
      label: "Pending Assignments",
      value: "2 Pending",
      subValue: "CS401 & CS402 Tasks",
      icon: Clock,
      iconBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      statusLabel: "Due in 3 Days",
      statusVariant: "warning",
      trendText: "High Priority",
      trendDir: "down",
      route: "/student/lms",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Executive Summary KPIs
        </h2>
        <span className="text-[11px] text-slate-400 font-mono">8 Modules Overview</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => {
          const IconComp = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigate(card.route)}
              className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
            >
              {/* TOP ROW: ICON & STATUS BADGE */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className={`p-2.5 rounded-xl ${card.iconBg} transition-transform group-hover:scale-110`}>
                  <IconComp className="h-4 w-4" />
                </div>
                
                <Badge
                  className={`text-[9px] px-2 py-0.5 font-bold font-mono border ${
                    card.statusVariant === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-500/20"
                      : card.statusVariant === "warning"
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-500/20"
                      : card.statusVariant === "danger"
                      ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-500/20"
                      : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 border-blue-500/20"
                  }`}
                >
                  {card.statusLabel}
                </Badge>
              </div>

              {/* VALUE & LABEL */}
              <div className="space-y-0.5">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  {card.label}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                    {card.value}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 group-hover:text-blue-600 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* FOOTER TREND & SUBVALUE */}
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="truncate">{card.subValue}</span>
                <span className="font-mono text-slate-500 font-semibold">{card.trendText}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
