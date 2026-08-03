import React from "react";
import { SubjectAttendanceItem, StudentAttendanceProfile } from "./types";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Sparkles,
  BarChart2,
  PieChart as PieIcon,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Brain,
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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface AnalyticsProps {
  profile: StudentAttendanceProfile;
  subjects: SubjectAttendanceItem[];
}

export function AttendanceAnalytics({ profile, subjects }: AnalyticsProps) {

  // Subject comparison data
  const subjectComparisonData = subjects.map((sub) => ({
    code: sub.subjectCode,
    name: sub.subjectName.length > 15 ? sub.subjectName.substring(0, 15) + "..." : sub.subjectName,
    pct: sub.attendancePct,
    cutoff: 75,
  }));

  // Semester comparison data
  const semesterData = [
    { sem: "Sem 1", pct: 90.2 },
    { sem: "Sem 2", pct: 88.5 },
    { sem: "Sem 3", pct: 85.0 },
    { sem: "Sem 4", pct: 87.4 },
    { sem: "Sem 5 (Current)", pct: 86.5 },
  ];

  // Radar comparison data
  const radarData = subjects.slice(0, 6).map((sub) => ({
    subject: sub.subjectCode,
    A: sub.attendancePct,
    fullMark: 100,
  }));

  return (
    <div className="space-y-6">

      {/* AI WIDGETS BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: AI Attendance Prediction */}
        <div className="p-5 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-br from-purple-50/60 via-white to-purple-50/20 dark:from-purple-950/30 dark:via-slate-900 dark:to-purple-950/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-purple-600 animate-pulse" /> AI Forecast Engine
            </span>
            <Badge className="bg-purple-600 text-white text-[10px]">End-Sem</Badge>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">88.4%</div>
          <p className="text-xs text-slate-500">Projected final semester attendance based on historical velocity.</p>
        </div>

        {/* Card 2: Shortage Risk Indicator */}
        <div className="p-5 rounded-2xl border border-red-200 dark:border-red-900/60 bg-gradient-to-br from-red-50/60 via-white to-red-50/20 dark:from-red-950/30 dark:via-slate-900 dark:to-red-950/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-red-600" /> Shortage Risk Alert
            </span>
            <Badge className="bg-red-600 text-white text-[10px]">1 Subject</Badge>
          </div>
          <div className="text-3xl font-extrabold text-red-600 font-display">OE311 (73.7%)</div>
          <p className="text-xs text-slate-500">Need 2 consecutive classes to reach safe 75% cutoff.</p>
        </div>

        {/* Card 3: Recommended Attendance Plan */}
        <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/20 dark:from-emerald-950/30 dark:via-slate-900 dark:to-emerald-950/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Recommended Action Plan
            </span>
            <Badge className="bg-emerald-600 text-white text-[10px]">Optimum Streak</Badge>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-display">Maintain Streak</div>
          <p className="text-xs text-slate-500">Attend next 5 upcoming labs to boost SGPA eligibility to distinction level.</p>
        </div>

      </div>

      {/* CHARTS GRID 1: SUBJECT COMPARISON BAR CHART & SEMESTER PROGRESSION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SUBJECT COMPARISON BAR CHART */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-600" /> Subject-wise Attendance Percentage Comparison
            </h4>
            <p className="text-xs text-slate-500">Individual subject percentage vs 75% cutoff baseline</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectComparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
                <XAxis dataKey="code" stroke="#94A3B8" fontSize={11} interval={0} angle={-25} textAnchor="end" />
                <YAxis domain={[50, 100]} stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                <Bar dataKey="pct" fill="#2563EB" radius={[6, 6, 0, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SEMESTER COMPARISON AREA CHART */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" /> Semester-by-Semester Attendance Growth
            </h4>
            <p className="text-xs text-slate-500">Comparison of final attendance across 5 semesters</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={semesterData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="sem" stroke="#94A3B8" fontSize={11} />
                <YAxis domain={[75, 100]} stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                <Area type="monotone" dataKey="pct" stroke="#10B981" fill="#10B98120" strokeWidth={3} name="Semester Attendance %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* CHARTS GRID 2: RADAR CHART & ATTENDANCE HEATMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* RADAR CHART */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-purple-600" /> Multi-Subject Radial Balance Chart
            </h4>
            <p className="text-xs text-slate-500">Radar distribution across core CSE subjects</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748B" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" fontSize={10} />
                <Radar name="Attendance %" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* HEATMAP VISUALIZATION */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" /> Attendance Heatmap Log (Last 90 Days)
            </h4>
            <p className="text-xs text-slate-500">Daily check-in intensity mapping</p>
          </div>

          <div className="grid grid-cols-12 gap-1.5 pt-2">
            {Array.from({ length: 84 }).map((_, idx) => {
              const isAbsent = idx === 12 || idx === 28 || idx === 45 || idx === 62;
              const isLeave = idx === 18 || idx === 54;
              return (
                <div
                  key={idx}
                  title={`Day ${idx + 1}: ${isAbsent ? "Absent" : isLeave ? "Leave" : "Present 100%"}`}
                  className={`h-6 rounded-md transition-all cursor-pointer hover:scale-110 ${
                    isAbsent
                      ? "bg-red-500"
                      : isLeave
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Older (Nov)</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Present</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-500"></span> Absent</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Leave</span>
            </div>
            <span>Recent (Jan)</span>
          </div>
        </div>

      </div>

    </div>
  );
}
