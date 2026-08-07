import React from "react";
import { Users, Award, AlertTriangle, CreditCard, ShieldCheck } from "lucide-react";
import type { StudentRecord } from "../../types";

interface StudentKPIsProps {
  students: StudentRecord[];
}

export function StudentKPIs({ students }: StudentKPIsProps) {
  const total = students.length;
  const active = students.filter((s) => s.status === "Active").length;
  const risk = students.filter((s) => s.status === "Risk" || s.attendancePct < 75).length;
  const honorRoll = students.filter((s) => s.cgpa >= 8.5).length;
  const pendingFees = students.filter((s) => s.feeStatus !== "Paid").length;
  const totalDues = students.reduce((acc, s) => acc + (s.feeAmount - s.feePaid), 0);

  const maleCount = students.filter((s) => s.gender === "Male").length;
  const femaleCount = students.filter((s) => s.gender === "Female").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total & Active Card */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
          <span>Student Enrollment</span>
          <Users className="size-4 text-primary" />
        </div>
        <p className="text-2xl font-bold font-mono text-primary">{total} Enrolled</p>
        <p className="text-[0.68rem] text-muted-foreground flex justify-between">
          <span>Active: {active}</span>
          <span>M: {maleCount} | F: {femaleCount}</span>
        </p>
      </div>

      {/* Honor Roll Card */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
          <span>Academic Honors</span>
          <Award className="size-4 text-emerald-500" />
        </div>
        <p className="text-2xl font-bold font-mono text-emerald-600">{honorRoll} Students</p>
        <p className="text-[0.68rem] text-emerald-600/80 font-medium">
          CGPA ≥ 8.5 Honor Standing
        </p>
      </div>

      {/* Risk Audit Card */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
          <span>Attendance & Status Risk</span>
          <AlertTriangle className="size-4 text-amber-500" />
        </div>
        <p className="text-2xl font-bold font-mono text-amber-600">{risk} Alerts</p>
        <p className="text-[0.68rem] text-muted-foreground">
          Attendance &lt; 75% or marked "Risk"
        </p>
      </div>

      {/* Finance Card */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
          <span>Outstanding Fees</span>
          <CreditCard className="size-4 text-purple-500" />
        </div>
        <p className="text-2xl font-bold font-mono text-purple-600">{pendingFees} Accounts</p>
        <p className="text-[0.68rem] text-purple-600/80 font-medium">
          Total Due: Rs {totalDues.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
