import React from "react";
import { Link } from "@tanstack/react-router";
import {
  FileSpreadsheet,
  TrendingUp,
  Award,
  Users,
  CalendarCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  FileCheck2,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const data = [
  { name: "Sem 1", passRate: 85, avgMarks: 72 },
  { name: "Sem 2", passRate: 88, avgMarks: 75 },
  { name: "Sem 3", passRate: 82, avgMarks: 68 },
  { name: "Sem 4", passRate: 90, avgMarks: 78 },
  { name: "Sem 5", passRate: 95, avgMarks: 82 },
  { name: "Sem 6", passRate: 92, avgMarks: 80 },
];

const upcomingExams = [
  { id: 1, subject: "CS401: Advanced AI", date: "Aug 10, 2026", time: "09:30 AM", hall: "LH-301" },
  { id: 2, subject: "EC304: VLSI Design", date: "Aug 12, 2026", time: "09:30 AM", hall: "LH-204" },
  { id: 3, subject: "ME308: CAD", date: "Aug 14, 2026", time: "02:00 PM", hall: "LH-105" },
];

const recentActivities = [
  { id: 1, text: "Dr. Sarah published internal marks for CS401.", time: "2 hours ago", icon: FileCheck2 },
  { id: 2, text: "Admin generated 420 Hall Tickets for CSE Dept.", time: "4 hours ago", icon: Award },
  { id: 3, text: "New Exam Schedule added for Spring 2026.", time: "1 day ago", icon: CalendarIcon },
];

export function ExaminationsModuleView() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <FileSpreadsheet className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Examinations Dashboard
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Live Overview
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Monitor examination schedules, results, and evaluation metrics.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" className="h-9 bg-brand-gradient text-white shadow-glow text-xs">
            <Link to="/examinations/schedule">Manage Schedules</Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Exams</span>
            <CalendarCheck className="size-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-blue-600 font-mono">14</div>
            <div className="text-xs text-muted-foreground mt-1">Scheduled for this month</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Hall Tickets</span>
            <Users className="size-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-indigo-600 font-mono">1,240</div>
            <div className="text-xs text-muted-foreground mt-1">Generated successfully</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Pass Rate</span>
            <TrendingUp className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-emerald-600 font-mono">92.4%</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">+2.1% from last sem</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Revaluations</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-amber-600 font-mono">42</div>
            <div className="text-xs text-amber-600 font-medium mt-1">Pending approvals</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Performance Trends</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                />
                <Line type="monotone" dataKey="passRate" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Pass Rate (%)" />
                <Line type="monotone" dataKey="avgMarks" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} name="Avg Marks" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-card border border-border shadow-sm p-5 flex flex-col">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Quick Actions</h3>
          <div className="flex-1 space-y-2">
            <Link to="/examinations/schedule" className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><CalendarIcon className="size-4" /></div>
                <span className="text-sm font-semibold">Schedule Exam</span>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
            <Link to="/examinations/hall-tickets" className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><Users className="size-4" /></div>
                <span className="text-sm font-semibold">Generate Hall Tickets</span>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
            <Link to="/examinations/internal-marks" className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><CheckCircle className="size-4" /></div>
                <span className="text-sm font-semibold">Enter Internal Marks</span>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
            <Link to="/results" className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><Award className="size-4" /></div>
                <span className="text-sm font-semibold">Publish Results</span>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <div className="rounded-2xl bg-card border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Upcoming Exams</h3>
            <Link to="/examinations/schedule" className="text-xs text-primary font-semibold hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {upcomingExams.map(exam => (
              <div key={exam.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                <div>
                  <p className="font-semibold text-sm">{exam.subject}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{exam.date} • {exam.time}</p>
                </div>
                <Badge variant="outline" className="font-mono text-xs bg-card">{exam.hall}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-card border border-border shadow-sm p-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map(act => (
              <div key={act.id} className="flex gap-3">
                <div className="relative mt-1">
                  <div className="p-1.5 rounded-full bg-primary/10 text-primary z-10 relative">
                    <act.icon className="size-3.5" />
                  </div>
                  <div className="absolute top-6 bottom-[-16px] left-1/2 w-px bg-border -translate-x-1/2 last:hidden" />
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium">{act.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
