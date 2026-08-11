import React from "react";
import { StudentExamProfile, UpcomingExamItem, InternalMarkItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Eye,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Bell,
  ChevronRight,
  ShieldCheck,
  FileText,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

interface ExamDashboardProps {
  profile: StudentExamProfile;
  upcomingExams: UpcomingExamItem[];
  internalMarks: InternalMarkItem[];
  onNavigateSubmodule: (submodule: "dashboard" | "hall-ticket" | "results" | "course-registration") => void;
  onOpenHallTicketModal: () => void;
  onApplyRevaluation: () => void;
}

export function ExamDashboard({
  profile,
  upcomingExams,
  internalMarks,
  onNavigateSubmodule,
  onOpenHallTicketModal,
  onApplyRevaluation,
}: ExamDashboardProps) {
  // Recharts Data for Internal Performance
  const internalChartData = internalMarks.map((m) => ({
    subject: m.subjectCode,
    mid1: m.mid1,
    mid2: m.mid2,
    total: m.totalInternal,
  }));

  // Semester Performance Chart Data
  const semChartData = [
    { sem: "Sem 1", sgpa: 8.90 },
    { sem: "Sem 2", sgpa: 8.75 },
    { sem: "Sem 3", sgpa: 8.85 },
    { sem: "Sem 4", sgpa: 9.15 },
  ];

  const circulars = [
    { title: "Semester V Examination Timetable & Seating Plan Released", date: "Feb 01, 2025", type: "Urgent" },
    { title: "Guidelines for Digital Hall Ticket Verification & Mobile Rules", date: "Jan 28, 2025", type: "Notice" },
    { title: "Internal Assessment Marks Recounting Portal Open", date: "Jan 25, 2025", type: "Info" },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. QUICK ACTIONS BANNER */}
      <div className="p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-850 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Exam Branch Quick Actions</h3>
            <p className="text-[11px] text-slate-500">Hall ticket generation, result portals & course registration</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={onOpenHallTicketModal} size="sm" className="rounded-xl text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm">
            <Download className="h-3.5 w-3.5" /> Download Hall Ticket
          </Button>
          <Button onClick={() => onNavigateSubmodule("results")} size="sm" variant="outline" className="rounded-xl text-xs bg-white dark:bg-slate-800 gap-1.5 border-slate-200 dark:border-slate-700">
            <Award className="h-3.5 w-3.5 text-purple-600" /> View Results
          </Button>
          <Button onClick={() => onNavigateSubmodule("course-registration")} size="sm" variant="outline" className="rounded-xl text-xs bg-white dark:bg-slate-800 gap-1.5 border-slate-200 dark:border-slate-700">
            <BookOpen className="h-3.5 w-3.5 text-emerald-600" /> Register Courses
          </Button>
          <Button onClick={onApplyRevaluation} size="sm" variant="outline" className="rounded-xl text-xs bg-white dark:bg-slate-800 gap-1.5 border-slate-200 dark:border-slate-700">
            <RotateCcw className="h-3.5 w-3.5 text-amber-600" /> Apply Revaluation
          </Button>
        </div>
      </div>

      {/* 2. 8 DASHBOARD METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Upcoming</span>
          <div className="text-lg font-bold font-display text-blue-600">5 Exams</div>
          <span className="text-[9px] text-slate-400">Feb 10 - Feb 18</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Completed</span>
          <div className="text-lg font-bold font-display text-emerald-600">20 Exams</div>
          <span className="text-[9px] text-slate-400">Past 4 Sems</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Internal Marks</span>
          <div className="text-lg font-bold font-display text-purple-600">5 / 5 Pub</div>
          <span className="text-[9px] text-emerald-600">Avg 38.2 / 40</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Ext Results</span>
          <div className="text-lg font-bold font-display text-slate-900 dark:text-white">Sem IV</div>
          <span className="text-[9px] text-emerald-600">SGPA: 9.15</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Registered</span>
          <div className="text-lg font-bold font-display text-slate-900 dark:text-white">5 Subjects</div>
          <span className="text-[9px] text-slate-400">17 Credits</span>
        </div>

        <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-emerald-600 block">Hall Ticket</span>
          <div className="text-sm font-bold text-emerald-600">Generated</div>
          <span className="text-[9px] text-emerald-600">Verified</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Backlogs</span>
          <div className="text-lg font-bold font-display text-emerald-600">0 Active</div>
          <span className="text-[9px] text-emerald-600">Clean Record</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Credits Reg</span>
          <div className="text-lg font-bold font-display text-blue-600">114 / 160</div>
          <span className="text-[9px] text-slate-400">Semester V</span>
        </div>
      </div>

      {/* 3. GRID LAYOUT: SCHEDULE & PERFORMANCE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Upcoming Schedule & Internal Performance) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upcoming Exam Schedule Widget */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Examination Schedule</h3>
              </div>
              <Badge className="bg-blue-500/10 text-blue-600 text-[10px] border-blue-500/20">
                AY {profile.academicYear} &middot; Sem V
              </Badge>
            </div>

            <div className="space-y-2.5">
              {upcomingExams.map((ex) => (
                <div key={ex.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold shrink-0">
                      {ex.subjectCode}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ex.subjectName}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{ex.examDate} &middot; {ex.timeSlot}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px]">Hall / Seat</span>
                      <strong className="text-blue-600 font-mono">{ex.hallNumber} ({ex.seatNumber})</strong>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">{ex.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Performance Chart */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-purple-600" /> Semester V Internal Assessment Performance
                </h3>
                <p className="text-[11px] text-slate-500">Mid-1 and Mid-2 internal marks distribution (Max 40)</p>
              </div>
              <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px]">
                Internal Score: 95.5%
              </Badge>
            </div>

            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={internalChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
                  <YAxis domain={[0, 40]} stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                  <Bar dataKey="mid1" fill="#93C5FD" name="Mid-1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mid2" fill="#2563EB" name="Mid-2" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="#10B981" name="Total Internal" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column (Circulars & Semester SGPA Trend) */}
        <div className="space-y-6">
          
          {/* Semester Performance Line Chart */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" /> SGPA Growth Progression
            </h3>
            
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={semChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="sem" stroke="#94A3B8" fontSize={11} />
                  <YAxis domain={[7.5, 10]} stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="sgpa" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} name="SGPA" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs flex justify-between">
              <span>Overall CGPA: <strong className="text-emerald-600 font-mono font-bold">{profile.cgpa}</strong></span>
              <span>University Rank: <strong className="text-blue-600 font-mono font-bold">#{profile.rank} / {profile.totalStudents}</strong></span>
            </div>
          </div>

          {/* Exam Notifications & Circulars */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-500" /> Exam Circulars & Notices
            </h3>

            <div className="space-y-2">
              {circulars.map((circ, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px]">
                      {circ.type}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono">{circ.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{circ.title}</h4>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
