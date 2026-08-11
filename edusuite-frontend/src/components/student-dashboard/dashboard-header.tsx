import React from "react";
import { StudentInfo } from "./types";
import { Search, Calendar, GraduationCap, Building2, User } from "lucide-react";

interface DashboardHeaderProps {
  student: StudentInfo;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  student,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-indigo-900/40">
      {/* Subtle Background Elements */}
      <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Student Info */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Active Academic Session 2026-27
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Good Morning, {student.name} <span className="inline-block animate-bounce">👋</span>
          </h1>

          {/* Student Badges Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-200">
            <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              <User className="h-3.5 w-3.5 text-indigo-400" /> Roll No: <strong className="text-white">{student.rollNo}</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              <Building2 className="h-3.5 w-3.5 text-indigo-400" /> {student.department}
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              <GraduationCap className="h-3.5 w-3.5 text-indigo-400" /> {student.semester}
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" /> {student.todayDate}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
