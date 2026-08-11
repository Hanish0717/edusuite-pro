import React from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertCircle, Award, MessageSquare, CheckCircle2 } from "lucide-react";

interface DisciplinaryTabProps {
  student: StudentProfileData;
}

export function DisciplinaryTab({ student }: DisciplinaryTabProps) {
  const records = student.disciplinary;
  const warnings = records.filter((r) => r.type === "Warning" || r.type === "Suspension");
  const positive = records.filter((r) => r.type === "Positive Behaviour" || r.type === "Counselling");

  return (
    <div className="space-y-6">
      
      {/* STATUS BANNER */}
      <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white grid place-items-center shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Clean Conduct Status</h3>
            <p className="text-xs text-slate-500">Student maintains good standing with zero active disciplinary suspensions.</p>
          </div>
        </div>
        <Badge className="bg-emerald-600 text-white font-bold px-3 py-1 text-xs">
          EXEMPLARY STANDING
        </Badge>
      </div>

      {/* DISCIPLINARY LOGS LIST */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-600" /> Official Conduct & Commendation Log
        </h4>

        <div className="space-y-3">
          {records.map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                rec.type === "Positive Behaviour"
                  ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10"
                  : "border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      rec.type === "Positive Behaviour"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]"
                    }
                  >
                    {rec.type}
                  </Badge>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{rec.title}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{rec.description}</p>
                <div className="text-[11px] text-slate-500">Action: <strong className="text-slate-800 dark:text-slate-200">{rec.actionTaken}</strong></div>
              </div>

              <div className="text-right sm:text-right shrink-0 text-xs font-mono">
                <div className="text-slate-400">{rec.date}</div>
                <div className="text-slate-500 text-[10px]">Issued by: {rec.issuedBy}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
