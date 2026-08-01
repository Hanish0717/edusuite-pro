import React from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertTriangle, CheckCircle2, Calendar, Clock, Send, FileText } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface AttendanceTabProps {
  student: StudentProfileData;
  onApplyLeave: () => void;
}

export function AttendanceTab({ student, onApplyLeave }: AttendanceTabProps) {
  const att = student.attendanceSummary;

  return (
    <div className="space-y-6">
      
      {/* 1. OVERALL ATTENDANCE & SHORTAGE ALERT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2 text-center md:text-left">
          <span className="text-xs font-semibold text-slate-500">Overall Attendance Score</span>
          <div className="text-3xl font-black font-display text-blue-600">
            {att.overallPercentage}%
          </div>
          <p className="text-[11px] text-slate-500">Above statutory requirement of 75.0%</p>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
            COMPLIANT FOR EXAMS
          </Badge>
        </div>

        <div className="md:col-span-2 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" /> Apply Duty Leave or Medical Absence
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Submit attendance condonation applications directly to HOD.</p>
          </div>
          <Button onClick={onApplyLeave} size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm">
            <Send className="h-3.5 w-3.5" /> Apply Leave Condonation
          </Button>
        </div>

      </div>

      {/* 2. MONTHLY ATTENDANCE BAR CHART */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart className="h-4 w-4 text-blue-600" /> Monthly Class Attendance Percentage
        </h4>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={att.monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
              <YAxis domain={[50, 100]} stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
              <Bar dataKey="percentage" fill="#2563EB" radius={[6, 6, 0, 0]} name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. SUBJECT WISE ATTENDANCE TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-600" /> Subject-wise Attendance Breakdown
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/50">
                <th className="p-3 rounded-l-xl">Code</th>
                <th className="p-3">Subject Name</th>
                <th className="p-3">Classes Attended</th>
                <th className="p-3">Total Classes</th>
                <th className="p-3">Percentage</th>
                <th className="p-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {att.subjectWise.map((sub) => (
                <tr key={sub.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold font-mono text-blue-600">{sub.code}</td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">{sub.subject}</td>
                  <td className="p-3 font-mono">{sub.attended}</td>
                  <td className="p-3 font-mono">{sub.total}</td>
                  <td className="p-3 font-bold font-mono text-slate-900 dark:text-white">{sub.percentage}%</td>
                  <td className="p-3">
                    {sub.percentage >= 75 ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Normal</Badge>
                    ) : (
                      <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px]">Shortage Warning</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
