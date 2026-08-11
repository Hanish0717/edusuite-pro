import React from "react";
import { IdCardRequest } from "./types";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

interface RequestStatusTrackerProps {
  requests: IdCardRequest[];
}

export function RequestStatusTracker({ requests }: RequestStatusTrackerProps) {
  
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;
  const completedCount = requests.filter((r) => r.status === "Completed").length;

  return (
    <div className="space-y-6">

      {/* WORKFLOW SUMMARY HIGHLIGHT BANNER */}
      <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-gradient-to-r from-blue-50/50 via-slate-50 to-indigo-50/30 dark:from-blue-950/20 dark:via-slate-900 dark:to-indigo-950/20 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Official Identity Pass Request Approval Workflow
            </h3>
          </div>
          <Badge className="bg-blue-600 text-white font-mono text-[10px]">
            Assigned to Librarian Module
          </Badge>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          All Student ID Card requests (Lost Card Reports, Corrections, and Reprints) are automatically assigned to the Chief Librarian for verification and physical card printing.
        </p>

        {/* WORKFLOW PIPELINE VISUALIZER */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center font-mono text-xs">
          <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
            <span className="text-[10px] text-slate-400 block font-sans">Step 1</span>
            <strong>Student Request</strong>
          </div>
          <div className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300">
            <span className="text-[10px] text-slate-400 block font-sans">Step 2</span>
            <strong>Pending Librarian</strong>
          </div>
          <div className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300">
            <span className="text-[10px] text-slate-400 block font-sans">Step 3</span>
            <strong>Librarian Approval</strong>
          </div>
          <div className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300">
            <span className="text-[10px] text-slate-400 block font-sans">Step 4</span>
            <strong>Card Printing</strong>
          </div>
          <div className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300">
            <span className="text-[10px] text-slate-400 block font-sans">Step 5</span>
            <strong>Completed / Issued</strong>
          </div>
        </div>
      </div>

      {/* STATUS COUNT METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Pending Approval</span>
            <div className="text-xl font-bold text-amber-600">{pendingCount}</div>
          </div>
          <Clock className="h-5 w-5 text-amber-500" />
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Approved</span>
            <div className="text-xl font-bold text-blue-600">{approvedCount}</div>
          </div>
          <ShieldCheck className="h-5 w-5 text-blue-500" />
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Rejected</span>
            <div className="text-xl font-bold text-rose-600">{rejectedCount}</div>
          </div>
          <XCircle className="h-5 w-5 text-rose-500" />
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Completed</span>
            <div className="text-xl font-bold text-emerald-600">{completedCount}</div>
          </div>
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        </div>
      </div>

      {/* REQUESTS LIST LEDGER */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600" /> Active & Past ID Card Requests
        </h4>

        {requests.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">No requests submitted yet.</div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const statusColors = {
                Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
                Approved: "bg-blue-500/10 text-blue-600 border-blue-500/20",
                Rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20",
                Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
              };

              return (
                <div
                  key={req.requestId}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{req.requestId}</span>
                      <Badge variant="outline" className={statusColors[req.status] || ""}>
                        {req.status}
                      </Badge>
                      <Badge className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px]">
                        {req.requestType}
                      </Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{req.details}</p>
                    {req.remarks && (
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 italic">
                        Note: {req.remarks}
                      </p>
                    )}
                  </div>

                  <div className="text-right text-[11px] text-slate-500 font-mono shrink-0">
                    <div>Submitted: {req.submittedDate}</div>
                    <div className="text-blue-600 font-semibold">Assigned To: {req.assignedTo}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
