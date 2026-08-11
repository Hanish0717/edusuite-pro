import React from "react";
import { Users, AlertTriangle, ShieldCheck, CreditCard, Award, GraduationCap, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StudentKPIs } from "../components/cards/StudentKPIs";
import type { StudentRecord } from "../types";

interface DashboardProps {
  students: StudentRecord[];
}

export function Dashboard({ students }: DashboardProps) {
  const total = students.length;
  
  // Department Distribution
  const deptsCount = students.reduce((acc, curr) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Status Distribution
  const active = students.filter((s) => s.status === "Active").length;
  const risk = students.filter((s) => s.status === "Risk").length;
  const graduated = students.filter((s) => s.status === "Graduated").length;

  return (
    <div className="space-y-6">
      {/* KPI Metrics */}
      <StudentKPIs students={students} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Strength Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Building2 className="size-4 text-primary" /> Department Distribution Strength
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enrolled strength distributed across active ERP department categories.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {Object.entries(deptsCount).map(([dept, count]) => {
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={dept} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-foreground">
                    <span>{dept} Department</span>
                    <span className="font-mono text-muted-foreground">
                      {count} Students ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-gradient rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Status and Risk List */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" /> Student Standing & Risk Profile
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Current academic registration status logs.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Active Widget */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
                  <ShieldCheck className="size-4" />
                </span>
                <span className="text-xs font-semibold text-foreground">Active Learners</span>
              </div>
              <Badge variant="secondary" className="font-mono text-xs">{active}</Badge>
            </div>

            {/* Risk Widget */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-red-500/10 text-red-600 rounded-lg">
                  <AlertTriangle className="size-4" />
                </span>
                <span className="text-xs font-semibold text-foreground">Risk (Attendance/GPA)</span>
              </div>
              <Badge variant="secondary" className="font-mono text-xs text-red-600 bg-red-500/5">{risk}</Badge>
            </div>

            {/* Graduated Widget */}
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-500/10 text-blue-600 rounded-lg">
                  <Award className="size-4" />
                </span>
                <span className="text-xs font-semibold text-foreground">Graduated Alumni</span>
              </div>
              <Badge variant="secondary" className="font-mono text-xs">{graduated}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Admissions list */}
      <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Users className="size-4 text-primary" /> Recent Institutional Registrations
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            The latest student profiles generated in the ERP master ledger.
          </p>
        </div>

        <div className="divide-y divide-border/60">
          {students.slice(0, 3).map((s) => (
            <div key={s.id} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {s.fullName[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{s.fullName}</h4>
                  <p className="text-[0.68rem] text-muted-foreground font-mono">{s.rollNo} • {s.department}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-[0.65rem] font-mono">
                  {s.enrollmentDate}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
