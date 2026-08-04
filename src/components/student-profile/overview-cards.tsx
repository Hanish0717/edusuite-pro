import React from "react";
import { StudentProfileData } from "./types";
import {
  FileText,
  Award,
  Calendar,
  BookOpen,
  DollarSign,
  Library,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Sparkles,
} from "lucide-react";

interface OverviewCardsProps {
  student: StudentProfileData;
  onAdvisorClick?: () => void;
}

export function OverviewCardsGrid({ student, onAdvisorClick }: OverviewCardsProps) {
  const cards = [
    {
      id: "enrollment",
      label: "Enrollment Number",
      value: student.enrollmentNumber,
      subtext: `Ref: ${student.registrationNumber}`,
      icon: FileText,
      accent: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40",
      badge: "Verified",
      badgeColor: "bg-blue-500/10 text-blue-600",
    },
    {
      id: "cgpa",
      label: "Current CGPA",
      value: `${student.cgpa} / ${student.maxCgpa}`,
      subtext: "First Class with Distinction",
      icon: Award,
      accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40",
      badge: "Distinction",
      badgeColor: "bg-emerald-500/10 text-emerald-600",
    },
    {
      id: "attendance",
      label: "Attendance %",
      value: `${student.attendancePercentage}%`,
      subtext: "Good Standing (>75% required)",
      icon: TrendingUp,
      accent: student.attendancePercentage >= 75
        ? "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40"
        : "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40",
      badge: student.attendancePercentage >= 85 ? "Excellent" : "Compliant",
      badgeColor: "bg-blue-500/10 text-blue-600",
    },
    {
      id: "fees",
      label: "Fee Status",
      value: student.feeStatus,
      subtext: student.feePendingAmount === 0 ? "₹0 Pending Balance" : `₹${student.feePendingAmount.toLocaleString()} Due`,
      icon: DollarSign,
      accent: student.feeStatus === "Paid"
        ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40"
        : "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40",
      badge: student.feeStatus === "Paid" ? "100% Cleared" : "Action Needed",
      badgeColor: student.feeStatus === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600",
    },
    {
      id: "library",
      label: "Library Books",
      value: `${student.libraryBooksIssued} Issued`,
      subtext: `${student.libraryOverdueCount} Overdue Books`,
      icon: Library,
      accent: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/40",
      badge: "Regular Reader",
      badgeColor: "bg-purple-500/10 text-purple-600",
    },
    {
      id: "scholarships",
      label: "Scholarships",
      value: `₹ ${(student.scholarshipAmount / 1000).toFixed(0)}k / Year`,
      subtext: student.scholarshipName,
      icon: Sparkles,
      accent: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40",
      badge: "Merit Active",
      badgeColor: "bg-amber-500/10 text-amber-600",
    },
    {
      id: "backlogs",
      label: "Backlogs",
      value: student.activeBacklogs === 0 ? "0 Active" : `${student.activeBacklogs} Backlogs`,
      subtext: "Clean Academic Track",
      icon: student.activeBacklogs === 0 ? CheckCircle : AlertCircle,
      accent: student.activeBacklogs === 0
        ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40"
        : "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/40",
      badge: student.activeBacklogs === 0 ? "All Clear" : "Pending",
      badgeColor: student.activeBacklogs === 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600",
    },
    {
      id: "credits",
      label: "Credits Earned",
      value: `${student.creditsEarned} / ${student.totalRequiredCredits}`,
      subtext: `${Math.round((student.creditsEarned / student.totalRequiredCredits) * 100)}% Degree Completion`,
      icon: BookOpen,
      accent: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40",
      badge: "Semester V",
      badgeColor: "bg-indigo-500/10 text-indigo-600",
    },
    {
      id: "semester",
      label: "Current Semester",
      value: `Sem ${student.currentSemester} of ${student.totalSemesters}`,
      subtext: `${student.branch} (${student.section})`,
      icon: Calendar,
      accent: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40",
      badge: student.academicYear,
      badgeColor: "bg-blue-500/10 text-blue-600",
    },
    {
      id: "advisor",
      label: "Academic Advisor",
      value: student.academicAdvisor.name,
      subtext: student.academicAdvisor.designation,
      icon: UserCheck,
      accent: "text-teal-600 bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900/40",
      badge: "Assigned Mentor",
      badgeColor: "bg-teal-500/10 text-teal-600",
      isInteractive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            onClick={card.isInteractive ? onAdvisorClick : undefined}
            className={`group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
              card.isInteractive ? "cursor-pointer hover:border-blue-300 dark:hover:border-blue-700" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                {card.label}
              </span>
              <div className={`p-2 rounded-lg border ${card.accent}`}>
                <IconComponent className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-lg font-bold font-display tracking-tight text-slate-900 dark:text-white truncate">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title={card.subtext}>
                {card.subtext}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-current/10 ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
