import React from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

const departmentData = [
  { name: "CSE", passRate: 92, failRate: 8, avgScore: 82 },
  { name: "ECE", passRate: 85, failRate: 15, avgScore: 76 },
  { name: "ME", passRate: 78, failRate: 22, avgScore: 71 },
  { name: "AI&DS", passRate: 95, failRate: 5, avgScore: 88 },
];

const gradeDistribution = [
  { name: "O (Outstanding)", value: 45, color: "#10b981" },
  { name: "A+ (Excellent)", value: 120, color: "#34d399" },
  { name: "A (Very Good)", value: 200, color: "#3b82f6" },
  { name: "B+ (Good)", value: 180, color: "#60a5fa" },
  { name: "B (Above Avg)", value: 150, color: "#a78bfa" },
  { name: "C (Avg)", value: 80, color: "#f59e0b" },
  { name: "P (Pass)", value: 30, color: "#fbbf24" },
  { name: "F (Fail)", value: 15, color: "#ef4444" },
];

const trendData = [
  { semester: "Spring 2024", passPercent: 88 },
  { semester: "Fall 2024", passPercent: 86 },
  { semester: "Spring 2025", passPercent: 89 },
  { semester: "Fall 2025", passPercent: 91 },
  { semester: "Spring 2026", passPercent: 94 },
];

export function ExamAnalyticsComponent() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
            <BarChart3 className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Exam Analytics & Insights
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-indigo-500 border-indigo-500/30">
                Performance Tracking
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Analyze pass/fail percentages, grade distributions, and historical trends.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Select defaultValue="spring2026">
            <SelectTrigger className="w-[160px] h-9 text-xs">
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spring2026">Spring 2026</SelectItem>
              <SelectItem value="fall2025">Fall 2025</SelectItem>
              <SelectItem value="spring2025">Spring 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-medium">
            <Filter className="size-3.5" /> Filters
          </Button>
          <Button size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-xs font-semibold shadow-glow">
            <Download className="size-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overall Pass Rate</span>
          <div className="mt-2">
            <div className="text-3xl font-bold text-emerald-600 font-mono">92.8%</div>
            <div className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="size-3" /> +1.2% since last semester
            </div>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Students Appeared</span>
          <div className="mt-2">
            <div className="text-3xl font-bold text-blue-600 font-mono">1,452</div>
            <div className="text-xs text-muted-foreground mt-1">Across all departments</div>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Distinction Count</span>
          <div className="mt-2">
            <div className="text-3xl font-bold text-purple-600 font-mono">312</div>
            <div className="text-xs text-purple-600 font-medium mt-1">CGPA &ge; 8.5</div>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Highest Failure Rate</span>
          <div className="mt-2">
            <div className="text-3xl font-bold text-red-600 font-mono">ME Dept</div>
            <div className="text-xs text-red-600 font-medium mt-1">22% Failure (CAD)</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-card border border-border shadow-sm p-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-6">Department Wise Performance</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Legend iconType="circle" />
                <Bar dataKey="passRate" name="Pass %" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="failRate" name="Fail %" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border shadow-sm p-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">Grade Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-card border border-border shadow-sm p-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-6">Pass Percentage Trend (Last 5 Semesters)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="passPercent" name="Pass Rate (%)" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
