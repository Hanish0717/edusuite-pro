import React, { useState, useEffect } from "react";
import { StudentInfo } from "./types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Bell,
  Clock,
  Sparkles,
  User,
  ShieldCheck,
  Calendar,
  Building2,
  GraduationCap,
  BookOpen,
  Filter,
  CheckCircle2,
  X,
  FileText,
  IdCard,
} from "lucide-react";
import { toast } from "sonner";

interface StudentDashboardHeaderProps {
  student: StudentInfo;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenDigitalId: () => void;
  onGenerateBonafide: () => void;
}

export function StudentDashboardHeader({
  student,
  searchQuery,
  onSearchChange,
  unreadCount,
  onOpenNotifications,
  onOpenDigitalId,
  onGenerateBonafide,
}: StudentDashboardHeaderProps) {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setCurrentDateTime(now.toLocaleString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* TOP HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
        {/* Subtle Background Accent Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* LEFT: STUDENT WELCOME & CORE INFO */}
        <div className="flex items-start gap-4 relative z-10">
          <div className="relative group">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-600/20 shadow-md transition-transform group-hover:scale-105"
            />
            <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" title="Active Account" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back, {student.name}
              </h1>
              <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-mono text-[11px] px-2 py-0.5">
                {student.rollNumber}
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[11px] px-2 py-0.5 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> {student.status}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                {student.program} in {student.department}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                Sem {student.currentSemester} (AY {student.academicYear})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3 w-3 text-slate-400" />
                Last Login: {student.lastLogin}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: SEARCH, TIME & ACTIONS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
          
          {/* SEARCH INPUT */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search subjects, fees, exams..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-8 h-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* NOTIFICATION BUTTON */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onOpenNotifications}
              variant="outline"
              size="sm"
              className="relative h-9 px-3 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              title="Notifications Drawer"
            >
              <Bell className="h-4 w-4 text-slate-700 dark:text-slate-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* DIGITAL ID CARD BUTTON */}
            <Button
              onClick={onOpenDigitalId}
              size="sm"
              className="h-9 text-xs rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 shadow-sm shadow-blue-500/20"
            >
              <IdCard className="h-3.5 w-3.5" /> ID Card
            </Button>
          </div>

        </div>

      </div>

      {/* LIVE DATE & TIME BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>LIVE ERP SESSION</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span>{currentDateTime || "Syncing time..."}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-sans text-slate-500">
          <button
            onClick={onGenerateBonafide}
            className="hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors"
          >
            <FileText className="h-3 w-3 text-blue-600" /> Generate Bonafide
          </button>
          <span>•</span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> System Status: All Operational
          </span>
        </div>
      </div>
    </div>
  );
}
