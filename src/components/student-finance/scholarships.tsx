import React from "react";
import { ScholarshipItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Plus, Upload, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface ScholarshipsProps {
  scholarships: ScholarshipItem[];
  onOpenScholarshipModal: () => void;
}

export function Scholarships({ scholarships, onOpenScholarshipModal }: ScholarshipsProps) {
  const totalApproved = scholarships
    .filter((s) => s.status === "Approved")
    .reduce((sum, s) => sum + s.approvedAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP CARDS (6 SCHOLARSHIP METRICS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/20 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-purple-600 block">Total Approved Grant</span>
          <div className="text-lg font-bold font-display text-purple-600 font-mono">₹{totalApproved.toLocaleString()}</div>
          <span className="text-[9px] text-purple-600 font-semibold">2 Grants Active</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Pending Verification</span>
          <div className="text-lg font-bold font-display text-amber-600 font-mono">1 Fellowship</div>
          <span className="text-[9px] text-slate-400">Under Review</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Government Schemes</span>
          <div className="text-lg font-bold font-display text-blue-600 font-mono">₹50,000</div>
          <span className="text-[9px] text-slate-400">State Merit</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Institutional Scholarship</span>
          <div className="text-lg font-bold font-display text-slate-900 dark:text-white font-mono">₹30,000</div>
          <span className="text-[9px] text-slate-400">STEM Fellowship</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Merit Scholarship</span>
          <div className="text-lg font-bold font-display text-emerald-600 font-mono">₹25,000</div>
          <span className="text-[9px] text-emerald-600 font-semibold">Excellence Award</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1">
          <span className="text-[10px] font-semibold text-slate-500 block">Renewal Schedule</span>
          <div className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-1">Aug 15, 2025</div>
          <span className="text-[9px] text-slate-400 font-semibold">Sem VI Verification</span>
        </div>
      </div>

      {/* 2. TABLE & APPLY TOOLBAR */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-600" /> Scholarships & Financial Grants Ledger
            </h3>
            <p className="text-xs text-slate-500">Government schemes, institutional waivers and merit rewards</p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={onOpenScholarshipModal} size="sm" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 shadow-sm">
              <Plus className="h-3.5 w-3.5" /> Apply New Scholarship
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold">
                <th className="p-3">Scholarship Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Approved Amount (₹)</th>
                <th className="p-3">Disbursed Amount</th>
                <th className="p-3">Approval Stage</th>
                <th className="p-3">Renewal Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {scholarships.map((sch) => (
                <tr key={sch.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{sch.name}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-200">{sch.category}</Badge>
                  </td>
                  <td className="p-3 font-bold font-mono text-purple-600 text-xs">₹{sch.approvedAmount.toLocaleString()}</td>
                  <td className="p-3 font-mono text-emerald-600 font-bold">₹{sch.disbursedAmount.toLocaleString()}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{sch.approvalStage}</td>
                  <td className="p-3 font-mono text-slate-500">{sch.renewalDate}</td>
                  <td className="p-3">
                    <Badge className={sch.status === "Approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                      {sch.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 p-1 gap-1" onClick={() => toast.info(`Document re-upload opened for ${sch.name}`)}>
                      <Upload className="h-3 w-3" /> Upload Docs
                    </Button>
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
