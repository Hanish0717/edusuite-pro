import React from "react";
import {
  StudentAttendanceProfile,
  SubjectAttendanceItem,
  DailyAttendanceRecord,
} from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Flame,
  Award,
  Calendar,
  FileText,
  Sparkles,
  TrendingUp,
  Download,
  BookOpen,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AttendanceDashboardProps {
  profile: StudentAttendanceProfile;
  subjects: SubjectAttendanceItem[];
  recentLogs: DailyAttendanceRecord[];
  onOpenLeaveModal: () => void;
  onSelectTab: (tab: any) => void;
  onSelectSubject: (sub: SubjectAttendanceItem) => void;
}

export function AttendanceDashboard({
  profile,
  subjects,
  recentLogs,
  onOpenLeaveModal,
  onSelectTab,
  onSelectSubject,
}: AttendanceDashboardProps) {

  // Monthly trend data
  const monthlyTrendData = [
    { month: "Aug", pct: 88.0 },
    { month: "Sep", pct: 85.5 },
    { month: "Oct", pct: 89.2 },
    { month: "Nov", pct: 87.0 },
    { month: "Dec", pct: 84.8 },
    { month: "Jan", pct: 86.5 },
  ];

  // Weekly attendance distribution
  const weeklyData = [
    { day: "Mon", present: 6, absent: 0 },
    { day: "Tue", present: 5, absent: 1 },
    { day: "Wed", present: 6, absent: 0 },
    { day: "Thu", present: 4, absent: 1 },
    { day: "Fri", present: 6, absent: 0 },
    { day: "Sat", present: 3, absent: 0 },
  ];

  // Distribution chart data
  const distributionData = [
    { name: "Present", value: profile.presentDays, color: "#10B981" },
    { name: "Absent", value: profile.absentDays, color: "#EF4444" },
    { name: "Leave", value: profile.leaveDays, color: "#F59E0B" },
    { name: "On Duty", value: profile.onDutyDays, color: "#3B82F6" },
  ];

  return (
    <div className="space-y-6">

      {/* 1. TOP KPI CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Card 1: Overall Attendance */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Overall Attendance</span>
            <CalendarCheck className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600 font-display pt-1">
            {profile.overallAttendancePct}%
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">
            Target: 75% Safe
          </Badge>
        </div>

        {/* Card 2: Today's Status */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today's Attendance</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-500 font-display pt-1">
            {profile.todayAttendanceStatus}
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">P1-P4 Marked via Biometric</span>
        </div>

        {/* Card 3: Present / Absent / Leave Days */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Present vs Absent</span>
            <XCircle className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display pt-1">
            {profile.presentDays}P / <span className="text-red-500">{profile.absentDays}A</span>
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">Leaves: {profile.leaveDays} | OD: {profile.onDutyDays}</span>
        </div>

        {/* Card 4: Current Streak */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Current Streak</span>
            <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-500 font-display pt-1">
            {profile.currentStreakDays} Days
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">Perfect Attendance</span>
        </div>

        {/* Card 5: Low Attendance Subjects */}
        <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Shortage Risk</span>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-red-500 font-display pt-1">
            {profile.lowAttendanceCount} Subject
          </div>
          <span className="text-[10px] text-red-600 font-semibold block font-mono">OE311 (73.7% Attendance)</span>
        </div>

      </div>

      {/* 2. QUICK ACTIONS & RULES STRIP */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Attendance Rule Criteria</h4>
            <p className="text-xs text-slate-500">75% Mandatory for Regular Exam Hall Ticket &middot; 65% Condonation Limit</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button onClick={onOpenLeaveModal} size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 font-semibold">
            <FileText className="h-3.5 w-3.5" /> Apply Leave
          </Button>
          <Button onClick={() => onSelectTab("reports")} size="sm" variant="outline" className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-800">
            <Download className="h-3.5 w-3.5" /> Download Report
          </Button>
          <Button onClick={() => onSelectTab("subject-wise")} size="sm" variant="outline" className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-800">
            <BookOpen className="h-3.5 w-3.5 text-purple-600" /> View Subjects
          </Button>
        </div>
      </div>

      {/* 3. MAIN WIDGETS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN (2 SPANS): CHARTS & TODAY'S CLASSES */}
        <div className="lg:col-span-2 space-y-6">

          {/* MONTHLY TREND LINE CHART */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" /> Monthly Attendance Trend
                </h4>
                <p className="text-xs text-slate-500">Attendance percentage progression across months</p>
              </div>
              <Badge className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-100 font-mono text-[10px]">
                Sem 5 Average: 86.5%
              </Badge>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis domain={[70, 100]} stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="pct" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} name="Attendance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TODAY'S SCHEDULED CLASSES */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" /> Today's Scheduled Classes & Status
                </h4>
                <p className="text-xs text-slate-500">Live timetable period check-ins</p>
              </div>
              <Button onClick={() => onSelectTab("daily-log")} variant="ghost" size="sm" className="text-xs text-blue-600 hover:underline gap-1">
                View Full Log <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="space-y-2.5">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-600/10 text-blue-600 font-mono font-bold text-xs">
                      {log.period}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{log.subjectCode}</span> &middot; <span>{log.subjectName}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">{log.timeSlot} &middot; {log.room}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div className="hidden sm:block">
                      <span className="text-[10px] text-slate-400 block font-mono">{log.mode}</span>
                      <strong className="text-xs text-slate-700 dark:text-slate-300 font-mono">{log.checkInTime}</strong>
                    </div>
                    <Badge className={log.status === "Present" ? "bg-emerald-500/10 text-emerald-600" : log.status === "Absent" ? "bg-red-500/10 text-red-600" : "bg-purple-500/10 text-purple-600"}>
                      {log.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (1 SPAN): AI PREDICTION, RING CHART & HOLIDAYS */}
        <div className="space-y-6">

          {/* AI ATTENDANCE PREDICTION WIDGET */}
          <div className="p-5 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-br from-purple-50/60 via-white to-purple-50/20 dark:from-purple-950/30 dark:via-slate-900 dark:to-purple-950/20 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-purple-600 animate-pulse" /> AI Forecast Prediction
              </span>
              <Badge className="bg-purple-600 text-white text-[10px]">End-Sem Estimate</Badge>
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">88.4%</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Based on your historical attendance patterns and current 18-day streak, AI projects your final end-semester attendance at <strong>88.4%</strong>.
              </p>
            </div>

            <div className="pt-2 border-t border-purple-100 dark:border-purple-900/40 text-[11px] text-purple-700 dark:text-purple-300 font-medium">
              &bull; OE311 requires 2 classes to exit shortage risk.
            </div>
          </div>

          {/* ATTENDANCE DISTRIBUTION RING CHART */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Working Days Breakdown
            </h4>
            
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{profile.totalWorkingDays}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Days</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600 dark:text-slate-400">Present: <strong>{profile.presentDays}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="text-slate-600 dark:text-slate-400">Absent: <strong>{profile.absentDays}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-600 dark:text-slate-400">Leave: <strong>{profile.leaveDays}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-slate-600 dark:text-slate-400">On Duty: <strong>{profile.onDutyDays}</strong></span>
              </div>
            </div>
          </div>

          {/* UPCOMING HOLIDAYS WIDGET */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" /> Upcoming Campus Holidays
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Republic Day</div>
                  <span className="text-[10px] text-slate-500">National Holiday</span>
                </div>
                <Badge className="bg-blue-500/10 text-blue-600 font-mono">Jan 26</Badge>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Maha Shivaratri</div>
                  <span className="text-[10px] text-slate-500">Institutional Holiday</span>
                </div>
                <Badge className="bg-blue-500/10 text-blue-600 font-mono">Feb 26</Badge>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
